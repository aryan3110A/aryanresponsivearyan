"use client"

import { useState } from "react"
import { ChevronDown } from 'lucide-react'

interface OptionSelectorProps {
  onOptionSelect?: (option: string) => void
  selectedOption?: string | null
  title: string
  options: string[]
  defaultOpen?: boolean
  showBorderTop?: boolean
  className?: string
}

export default function OptionSelector({
  onOptionSelect,
  selectedOption,
  title,
  options,
  defaultOpen = false,
  showBorderTop = false,
  className = ""
}: OptionSelectorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [selected, setSelected] = useState<string | null>(selectedOption ?? null)

  const handleOptionSelect = (option: string) => {
    setSelected(option)
    if (onOptionSelect) {
      onOptionSelect(option)
    }
    // Close dropdown after selection for better UX
    setIsOpen(false)
  }

  return (
    <div className={className}>
      {showBorderTop && <div className=""></div>}
      
      <div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">{title}</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 md:h-6 md:w-6 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      
      {isOpen && (
        <div className="space-y-2 md:space-y-4 mb-4 px-2 md:px-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full px-3 py-2 md:p-3 rounded-lg text-left text-white text-sm md:text-lg transition-all duration-200 ${
                selected === option 
                   ? "bg-white/10 border-2 border-[#6C3BFF]"
                  : "bg-white/10 hover:bg-[#3A3A3A] border-2 border-transparent"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
