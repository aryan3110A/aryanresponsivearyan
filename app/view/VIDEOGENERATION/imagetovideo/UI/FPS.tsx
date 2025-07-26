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
        <h3 className="text-white text-lg md:text-xl font-medium">FPS</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isOpen && (
        <div className="grid grid-cols-4 gap-2 md:gap-4 px-2 md:px-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`h-[60px] border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                selectedOption === option 
                ? "border-[#6C3BFF] text-white bg-white/10" 
                : "text-gray-300 border-none bg-white/10 backdrop-blur-3xl hover:border-[#6C3BFF] hover:text-white"
              }`}
              onClick={() => handleFPSSelect(option)}
            >
              <span className="text-sm md:text-base font-medium">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
