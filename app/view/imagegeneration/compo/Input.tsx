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

const Input: React.FC<InputProps> = ({ onImageGenerated }) => {
  const [text, setText] = useState("");
  const [showSelectionModel, setShowSelectionModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTokens, setAvailableTokens] = useState(getTokens());
  const [settings, setSettings] = useState<GenerationSettings>({
    model: "Stable Diffusion 3.5 Large",
    tokenCost: 22,
    style: null,
    aspectRatio: "1:1",
    numberOfImages: 1,
  });

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                         */
  /* ---------------------------------------------------------------- */
  useEffect(() => setAvailableTokens(getTokens()), []);

  const handleSettingsSave = (s: GenerationSettings) => {
    setSettings(s);
    setShowSelectionModel(false);
  };

  const handleGenerate = async () => {
    if (!text.trim()) return setError("Please enter a prompt!");

    const total = settings.tokenCost * settings.numberOfImages;
    if (availableTokens < total)
      return setError(`You need ${total} tokens for this generation.`);

    setIsLoading(true);
    setError(null);

    try {
      /* -------- choose backend endpoint -------- */
      let endpoint = "https://api.wildmindai.com/generate";           // SD-Large
      if (settings.model === "Stable Diffusion 3.5 Medium")
        endpoint = "https://api.wildmindai.com/medium";
      else if (settings.model === "Flux.1 Dev")
        endpoint = "https://api.wildmindai.com/flux";                 // NO slash

      /* -------- final prompt -------- */
      const finalPrompt =
        settings.style ? `${text}, ${settings.style} style` : text;

      /* -------- call API -------- */
      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "wildmind_5879fcd4a8b94743b3a7c8c1a1b4",
          Accept: "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!r.ok)
        throw new Error((await r.json().catch(() => ({}))).detail ?? r.status);

      const { image_url } = await r.json();
      if (!image_url) throw new Error("No image URL returned.");

      if (deductTokens(total)) {
        setAvailableTokens(getTokens());
        onImageGenerated?.(image_url);
      }
    } catch (e: any) {
      console.error("Request failed:", e);
      setError(typeof e === "string" ? e : e.message || "Generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  JSX                                                             */
  /* ---------------------------------------------------------------- */
  return (
    <div className="text-white flex items-center relative justify-center -mt-16 mb:flex-col mb:gap-4 mb:mt-6">
      {/* overlay settings panel */}
      {showSelectionModel && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="absolute left-0 top-0 h-full w-[380px]">
            <SelectionModel
              onClose={() => setShowSelectionModel(false)}
              onSave={handleSettingsSave}
            />
          </div>
        </div>
      )}

      {/* input box */}
      <div className="relative w-[60vw] mb:w-[90vw]">
        <input
          type="text"
          value={text}
          disabled={isLoading}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          placeholder="Type a prompt..."
          className="w-full pr-[1rem] md:pr-[11rem] pl-4 py-2 rounded-full bg-gray-800 text-white outline-none h-16 mb:h-12"
        />

        {error && (
          <p className="text-red-500 text-xs md:text-sm mt-2 text-center">
            {error}
          </p>
        )}

        {/* desktop generate button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium
                      text-white bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] transition-colors mb:hidden
                      ${isLoading && "opacity-50 cursor-not-allowed"}`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Image
              src="/ImageGeneate/Group.svg"
              alt="Generate"
              width={24}
              height={24}
              className="mr-2"
            />
          )}
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* desktop settings button */}
      <button
        onClick={() => setShowSelectionModel(true)}
        className="bg-[#272626] rounded-full cursor-pointer ml-4 p-3 mb:hidden"
      >
        <Image
          src="/ImageGeneate/setting.svg"
          width={36}
          height={36}
          alt="Settings"
        />
      </button>

      {/* mobile controls */}
      <div className="hidden mb:flex mb:flex-row mb:justify-between mb:items-center mb:gap-4 mb:-mt-2 mb:w-[87vw]">
        <button
          onClick={() => setShowSelectionModel(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#272626]"
        >
          <Image
            src="/ImageGeneate/setting.svg"
            width={18}
            height={18}
            alt="Settings"
          />
        </button>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`flex items-center justify-center gap-1 px-4 py-[6px] rounded-full text-white text-sm font-medium
                      bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]
                      ${isLoading && "opacity-50 cursor-not-allowed"}`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>Generate</span>
              <Image
                src={getImageUrl("core", "coins") || "/placeholder.svg"}
                alt="coins"
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
