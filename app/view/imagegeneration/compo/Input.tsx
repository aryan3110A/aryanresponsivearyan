"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectionModel from "../selectionmodel/app-container";

interface InputProps {
  onImageGenerated?: (imageUrl: string) => void;
}

const Input: React.FC<InputProps> = ({ onImageGenerated }) => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showSelectionModel, setShowSelectionModel] = useState(false);

  const handleGenerate = async () => {
    if (!text) return alert("Please enter a prompt!");

    try {
      const response = await fetch("http://localhost:5001/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageUrl(data.image_url);
        if (onImageGenerated) {
          onImageGenerated(data.image_url);
        }
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="text-white flex items-center relative justify-center -mt-16 mb:flex-col mb:gap-4 mb:mt-6">
      {/* Settings panel overlay */}
      {showSelectionModel && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <div className="absolute left-0 top-0 h-full w-[380px]">
            <SelectionModel onClose={() => setShowSelectionModel(false)} />
          </div>
        </div>
      )}
  
      {/* Input box */}
      <div className="relative w-[60vw] mb:w-[90vw]">
        <input
          type="text"
          className="w-full pr-[4rem] pl-4 py-2 rounded-full bg-gray-800 text-white outline-none h-16 mb:h-12"
          placeholder="Type a prompt..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
  
        {/* Desktop generate button (absolute inside input box) */}
        <button
          onClick={handleGenerate}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium text-white transition-colors bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] mb:hidden"
        >
          <Image src="/ImageGeneate/Group.svg" alt="Generate" width={24} height={24} className="mr-2" />
          Generate
        </button>
      </div>
  
      {/* Desktop settings button (inline) */}
      <button
        onClick={() => setShowSelectionModel(true)}
        className="bg-[#272626] rounded-full cursor-pointer ml-4 p-3 mb:hidden"
      >
        <Image src="/ImageGeneate/setting.svg" width={36} height={36} alt="Settings" />
      </button>
  
    {/* Mobile layout ONLY */}
    <div className="hidden mb:flex mb:flex-row mb:justify-between mb:items-center mb:gap-4 mb:mt-3 mb:w-[90vw]">
    {/* Settings Button */}
    <button
        onClick={() => setShowSelectionModel(true)}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-[#272626]"
    >
        <Image src="/ImageGeneate/setting.svg" width={18} height={18} alt="Settings" />
    </button>

    {/* Generate Button with more height */}
    <button
        onClick={handleGenerate}
        className="flex items-center justify-center gap-1 px-4 py-[6px] rounded-full text-white text-sm font-medium bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
    >
        <span>Generate</span>
        <Image src="/ImageGeneate/coins.png" alt="coin" width={18} height={18} />
        <span className="ml-[2px] font-semibold">40</span>
    </button>
    </div>

      {/* Generated image preview */}
      {imageUrl && (
        <div className="mt-6 mb:w-[90vw]">
          <Image src={imageUrl} alt="Generated" width={800} height={600} className="w-auto h-auto" />
        </div>
      )}
    </div>
  );
  
};

export default Input;
