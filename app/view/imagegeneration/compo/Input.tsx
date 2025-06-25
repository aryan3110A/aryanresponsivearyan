/*  Input.tsx  */
/*  -----------------------------------------------------------------
    – Every backend path now **always ends with a slash** so we never
      trigger a 301/307 redirect (which breaks CORS pre-flight).

    – A single place (ENDPOINT) that maps “model name → URL”.
      Add / remove items here – the rest of the code stays untouched.

    – Better error handling (shows network failures too).

    – No other file in your project needs to change.
   ----------------------------------------------------------------- */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SelectionModel from "../selectionmodel/app-container";
import { getTokens, deductTokens } from "@/app/utils/tokenManager";
import { getImageUrl } from "@/routes/imageroute";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface InputProps {
  onImageGenerated?: (url: string) => void;
}

interface GenerationSettings {
  model: string;
  tokenCost: number;
  style: string | null;
  aspectRatio: string;
  numberOfImages: number;
}

/* ------------------------------------------------------------------ */
/* 1. ONE canonical map  ( **all entries end with “/” !** )            */
/* ------------------------------------------------------------------ */
const ENDPOINT: Record<string, string> = {
  "Stable Diffusion 3.5 Large":  "https://api.wildmindai.com/generate/",   // 🔧 + “/”
  "Stable Diffusion 3.5 Medium": "https://api.wildmindai.com/medium/",    // 🔧
  "Flux.1 Dev":                  "https://api.wildmindai.com/fluxdev/",   // 🔧
  "Stable Turbo":                "https://api.wildmindai.com/turbo/",     // 🔧
  "Flux.1 Schnell":              "https://api.wildmindai.com/fluxschnell/",
  "Stable XL":                   "https://api.wildmindai.com/xl/",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const Input: React.FC<InputProps> = ({ onImageGenerated }) => {
  /* ---------- state ---------- */
  const [prompt,  setPrompt]  = useState("");
  const [error,   setError]   = useState<string | null>(null);
  const [isBusy,  setBusy]    = useState(false);
  const [showSel, setShowSel] = useState(false);
  const [tokens,  setTokens]  = useState(getTokens());
  const [settings, setSettings] = useState<GenerationSettings>({
    model: "Stable Diffusion 3.5 Large",
    tokenCost: 22,
    style: null,
    aspectRatio: "1:1",
    numberOfImages: 1,
  });

  useEffect(() => setTokens(getTokens()), []);

  /* ---------- helpers ---------- */
  const saveSettings = (cfg: GenerationSettings) => {
    setSettings(cfg);
    setShowSel(false);
  };

  /* ---------- main action ---------- */
  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return setError("Please enter a prompt.");

    const totalCost = settings.tokenCost * settings.numberOfImages;
    if (tokens < totalCost)
      return setError(`You need ${totalCost} tokens for this generation.`);

    const url = ENDPOINT[settings.model];
    if (!url) return setError("Unknown model / backend route.");

    setBusy(true);
    setError(null);

    try {
      const finalPrompt = settings.style
        ? `${trimmed}, ${settings.style} style`
        : trimmed;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "wildmind_5879fcd4a8b94743b3a7c8c1a1b4",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!res.ok) {
        // Try to read a JSON 'detail' field; otherwise show status text
        const msg =
          (await res.json().catch(() => ({}))).detail ||
          `${res.status} ${res.statusText}`;
        throw new Error(msg);
      }

      const { image_url } = await res.json();
      if (!image_url) throw new Error("Backend did not return image_url.");

      /* deduct tokens & propagate to parent */
      if (deductTokens(totalCost)) {
        setTokens(getTokens());        // update UI
        onImageGenerated?.(image_url); // send to parent
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <div className="text-white flex items-center justify-center relative -mt-16 mb:flex-col mb:gap-4 mb:mt-6">
      {/* ───────── Settings drawer ───────── */}
      {showSel && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="absolute left-0 top-0 h-full w-[380px]">
            <SelectionModel onClose={() => setShowSel(false)} onSave={saveSettings} />
          </div>
        </div>
      )}

      {/* ───────── Prompt input ───────── */}
      <div className="relative w-[60vw] mb:w-[90vw]">
        <input
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setError(null); }}
          disabled={isBusy}
          placeholder="Type a prompt…"
          className="w-full h-16 mb:h-12 px-4 pr-[11rem] rounded-full bg-gray-800 text-white outline-none"
        />

        {error && (
          <p className="text-red-500 text-xs md:text-sm mt-2 text-center">{error}</p>
        )}

        {/* ───────── Desktop generate ───────── */}
        <button
          onClick={handleGenerate}
          disabled={isBusy}
          className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium text-white bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] ${isBusy && "opacity-50 cursor-not-allowed"} mb:hidden`}
        >
          {isBusy ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating…
            </>
          ) : (
            <>
              <Image src="/ImageGeneate/Group.svg" alt="" width={24} height={24} className="mr-2" />
              Generate
            </>
          )}
        </button>
      </div>

      {/* ───────── Desktop settings ───────── */}
      <button
        onClick={() => setShowSel(true)}
        className="bg-[#272626] rounded-full p-3 ml-4 mb:hidden"
      >
        <Image src="/ImageGeneate/setting.svg" width={36} height={36} alt="Settings" />
      </button>

      {/* ───────── Mobile bar ───────── */}
      <div className="hidden mb:flex mb:items-center mb:justify-between mb:gap-4 mb:w-[87vw] mb:-mt-2">
        <button
          onClick={() => setShowSel(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#272626]"
        >
          <Image src="/ImageGeneate/setting.svg" width={18} height={18} alt="Settings" />
        </button>

        <button
          onClick={handleGenerate}
          disabled={isBusy}
          className={`flex items-center gap-1 px-4 py-[6px] rounded-full text-white text-sm font-medium bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] ${isBusy && "opacity-50 cursor-not-allowed"}`}
        >
          {isBusy ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            <>
              Generate
              <Image
                src={getImageUrl("core", "coins") || "/placeholder.svg"}
                alt=""
                width={20}
                height={20}
                className="brightness-0 invert"
              />
              <span className="ml-[2px] font-poppins">
                {settings.tokenCost * settings.numberOfImages}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Input;
