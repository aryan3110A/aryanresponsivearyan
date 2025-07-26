"use client"

import { useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"

interface PromptEnhancerPanelProps {
  promptEnhance: string
  setPromptEnhance: (value: string) => void
  options?: string[]
}

export default function PromptEnhancerPanel({
  promptEnhance,
  setPromptEnhance,
  options = ["Auto", "Standard", "Creative"],
}: PromptEnhancerPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6"><div className="mx-2 md:mx-6 border-t border-white/15 mb-4 "></div>

      {/* Main Container - Styled like the image */}
      <div className="relative px-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/15 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4 flex items-center justify-between hover:bg-[#3A3A3A]/80 transition-all duration-200"
        >
          {/* Left side - Icon and Text */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-medium">Prompt Enhance</div>
              <div className="text-gray-300 text-xs">{promptEnhance}</div>
            </div>
          </div>

          {/* Right side - Chevron */}
          <ChevronDown
            className={`text-white h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute mx-6 top-full left-0 right-0 mt-2 bg-[#2A2A2A]/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option}
                  className={`w-full text-left px-4 py-3 text-white hover:bg-[#3A3A3A]/80 transition-all duration-200 ${
                    promptEnhance === option
                      ? "bg-gradient-to-r from-[#6C3BFF]/20 to-[#412399]/20 border-l-2 border-[#6C3BFF]"
                      : ""
                  }`}
                  onClick={() => {
                    setPromptEnhance(option)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    {promptEnhance === option && <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>}
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mx-2 md:mx-6 border-b border-white/15 mt-4 "></div>
    </div>
  )
}
