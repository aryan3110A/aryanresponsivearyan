"use client"

import { useState } from "react"
import { ChevronDown } from 'lucide-react'

interface FPSProps {
  onFPSSelect?: (fps: string) => void
  selectedFPS?: string | null
  customFPS?: string
  setCustomFPS?: (fps: string) => void
}

export default function FPS({
  onFPSSelect,
  selectedFPS,
  setCustomFPS,
}: FPSProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedFPS ?? null)

  const options = [
    "20 FPS",
    "40 FPS", 
    "60 FPS",
    "80 FPS",
  ]

  const handleFPSSelect = (option: string) => {
    setSelectedOption(option)
    if (onFPSSelect) {
      onFPSSelect(option)
    }
    if (setCustomFPS) {
      setCustomFPS("")
    }
  }

  return (
    <div>
      <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>
      <div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">FPS (Frames Per Second)</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isOpen && (
        <div className="space-y-2 mb-4 px-2 md:px-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-3 rounded-lg text-left text-white text-sm md:text-sm transition-all duration-200 ${
                selectedOption === option 
                   ? "bg-white/10 border-2 border-[#6C3BFF]"
                  : "bg-white/10 hover:bg-[#3A3A3A] border-2 border-transparent"
              }`}
              onClick={() => handleFPSSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
