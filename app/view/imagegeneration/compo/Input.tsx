"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SelectionModel from "../selectionmodel/app-container";
import { getTokens, deductTokens } from "@/app/utils/tokenManager";
import { getImageUrl } from "@/routes/imageroute";

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
/* 1. ONE canonical place that maps model ➜ backend URL               */
/*    – every entry *ends with a slash* so no redirect ever happens   */
/* ------------------------------------------------------------------ */
const ENDPOINT: Record<string, string> = {
  "Stable Diffusion 3.5 Large":  "https://api.wildmindai.com/generate",   // route is already "generate"
  "Stable Diffusion 3.5 Medium": "https://api.wildmindai.com/medium",
  "Flux.1 Dev":                  "https://api.wildmindai.com/fluxdev",
  "Stable Turbo":                "https://api.wildmindai.com/turbo",
  "Flux.1 Schnell":              "https://api.wildmindai.com/fluxschnell",
  "Stable XL":                   "https://api.wildmindai.com/xl",
};

const Input: React.FC<InputProps> = ({ onImageGenerated }) => {
  /* ------------------------- state setup ------------------------- */
  const [text, setText]                 = useState("");
  const [showSelection, setShowSelect]  = useState(false);
  const [isLoading, setLoading]         = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [availableTokens, setTokens]    = useState(getTokens());
  const [settings, setSettings]         = useState<GenerationSettings>({
    model: "Stable Diffusion 3.5 Large",
    tokenCost: 22,
    style: null,
    aspectRatio: "1:1",
    numberOfImages: 1,
  });

  useEffect(() => setTokens(getTokens()), []);

  const handleSettingsSave = (cfg: GenerationSettings) => {
    setSettings(cfg);
    setShowSelect(false);
  };

  /* ------------------------- main action ------------------------- */
  const handleGenerate = async () => {
    if (!text.trim())      return setError("Please enter a prompt!");
    const totalCost = settings.tokenCost * settings.numberOfImages;
    if (availableTokens < totalCost)
      return setError(`Not enough tokens – need ${totalCost}.`);

    const endpoint = ENDPOINT[settings.model];
    if (!endpoint) return setError("Unknown model endpoint!");

    setLoading(true); setError(null);
    try {
      const finalPrompt =
        settings.style ? `${text}, ${settings.style} style` : text;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "wildmind_5879fcd4a8b94743b3a7c8c1a1b4",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const { image_url } = await res.json();
      if (!image_url) throw new Error("No image URL in response");

      if (deductTokens(totalCost)) {
        setTokens(getTokens());
        onImageGenerated?.(image_url);
      }
    } catch (e: unknown) {
      console.error("Request failed:", e);
      if (e instanceof Error) {
        setError(e.message || "Generation failed – try again.");
      } else {
        setError(String(e) || "Generation failed – try again.");
      }
    }
    setLoading(false);
  };

  /* ------------------------- UI ------------------------- */
  return (
    <div className="text-white flex items-center justify-center relative -mt-16 mb:flex-col mb:gap-4 mb:mt-6">
      {/* Settings fly-out */}
      {showSelection && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="absolute left-0 top-0 h-full w-[380px]">
            <SelectionModel
              onClose={() => setShowSelect(false)}
              onSave={handleSettingsSave}
            />
          </div>
        </div>
      )}

      {/* Prompt input */}
      <div className="relative w-[60vw] mb:w-[90vw]">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setError(null); }}
          disabled={isLoading}
          placeholder="Type a prompt..."
          className="w-full h-16 mb:h-12 px-4 mb:pr-[1rem] pr-[11rem] rounded-full bg-gray-800 text-white outline-none"
        />

        {error && (
          <p className="text-red-500 text-xs md:text-sm mt-2 text-center">{error}</p>
        )}

        {/* Generate (desktop) */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium text-white bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] transition-colors ${isLoading && "opacity-50 cursor-not-allowed"} mb:hidden`}
        >
          {isLoading ? (
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

      {/* Settings button (desktop) */}
      <button
        onClick={() => setShowSelect(true)}
        className="bg-[#272626] rounded-full p-3 ml-4 mb:hidden"
      >
        <Image src="/ImageGeneate/setting.svg" width={36} height={36} alt="Settings" />
      </button>

      {/* Mobile bar */}
      <div className="hidden mb:flex mb:items-center mb:justify-between mb:gap-4 mb:w-[87vw] mb:-mt-2">
        <button
          onClick={() => setShowSelect(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#272626]"
        >
          <Image src="/ImageGeneate/setting.svg" width={18} height={18} alt="Settings" />
        </button>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`flex items-center gap-1 px-4 py-[6px] rounded-full text-white text-sm font-medium bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] ${isLoading && "opacity-50 cursor-not-allowed"}`}
        >
          {isLoading ? (
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
