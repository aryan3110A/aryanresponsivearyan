"use client"

import { useState } from "react"
import { ChevronDown } from 'lucide-react'

interface SelectColorProps {
  onColorSelect?: (color: string) => void
  selectedColor?: string | null
  customColor?: string
  setCustomColor?: (color: string) => void
}

export default function SelectColor({
  onColorSelect,
  selectedColor,
  customColor = "",
  setCustomColor,
}: SelectColorProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedColor ?? null)

  const options = [
    "Pink",
    "Blue",
    "Red",
    "Orange"
  ]

  const handleColorSelect = (option: string) => {
    setSelectedOption(option)
    if (onColorSelect) {
      onColorSelect(option)
    }
    if (setCustomColor) {
      setCustomColor("")
    }
  }

  return (
<div><div className="mx-2 md:mx-6 border-t border-white/15 mb-6 "></div>
<div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">Select Color</h3>
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
              onClick={() => handleColorSelect(option)}
            >
              {option}
            </button>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Enter Color Name"
              value={customColor}
              onChange={e => setCustomColor && setCustomColor(e.target.value)}
              className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#6C3BFF]"
            />
            {/* <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${customColor ? "border-[#6C3BFF]" : "border-gray-500"}`}>
              {customColor && <span className="block w-3 h-3 rounded-full bg-[#6C3BFF]" />}
            </span> */}
          </div>
        </div>
      )}
    </div>
  )
} 