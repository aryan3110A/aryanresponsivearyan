"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SelectionModel from "../selectionmodel/app-container";
import { getTokens, deductTokens } from "@/app/utils/tokenManager";
import { getImageUrl } from "@/routes/imageroute";

interface InputProps {
  onImageGenerated?: (imageUrl: string) => void;
}

const Input: React.FC<InputProps> = ({ onImageGenerated }) => {
  const [text, setText] = useState("");
  const [showSelectionModel, setShowSelectionModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTokens, setAvailableTokens] = useState(getTokens());

  useEffect(() => {
    setAvailableTokens(getTokens());
  }, []);

  const handleGenerate = async () => {
    if (!text) {
      setError("Please enter a prompt!");
      return;
    }

    if (availableTokens < 40) {
      setError("Not enough tokens! Please upgrade your plan.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Use the ngrok URL directly
      const endpoint = "https://fc94-2402-a00-402-4c59-a0eb-e1f8-9fb1-2227.ngrok-free.app/generate";
      
      console.log(`Attempting to connect to: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.image_url) {
        // Only deduct tokens if image generation was successful
        if (deductTokens()) {
          setAvailableTokens(getTokens());
          if (onImageGenerated) {
            onImageGenerated(data.image_url);
          }
        }
      } else {
        throw new Error("No image URL in response");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setError(error instanceof Error ? error.message : "Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
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
          className="w-full pr-[1rem] md:pr-[11rem] pl-4  py-2 rounded-full bg-gray-800 text-white outline-none h-16 mb:h-12"
          placeholder="Type a prompt..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          disabled={isLoading}
        />
  
        {/* Error message */}
        {error && (
          <p className="text-red-500 text-xs md:text-sm mt-2 text-center">{error}</p>
        )}
  
        {/* Desktop generate button (absolute inside input box) */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center px-4 lg:px-6 h-[2.5rem] lg:h-[3rem] rounded-full font-medium text-white transition-colors bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] mb:hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Image src="/ImageGeneate/Group.svg" alt="Generate" width={24} height={24} className="mr-2" />
          )}
          {isLoading ? 'Generating...' : 'Generate'}
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
      <div className="hidden mb:flex mb:flex-row mb:justify-between mb:items-center mb:gap-4 mb:-mt-2 mb:w-[87vw]">
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
          disabled={isLoading}
          className={`flex items-center justify-center gap-1 px-4 py-[6px] rounded-full text-white text-sm font-medium bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                <span className="ml-[2px] font-poppins">40</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Input;
