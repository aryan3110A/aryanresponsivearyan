"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from 'lucide-react'

interface SaveFileProps {
  onSaveFileTypeSelect?: (type: string) => void
  selectedOption?: string | null
  title?: string
  options?: string[]
  defaultOpen?: boolean
  showBorderTop?: boolean
  className?: string
}

export default function SaveFile({
  onSaveFileTypeSelect,
  selectedOption,
  title = "Save File Type",
  options = ["GIF", "JPG", "PNG", "SVG"],
  defaultOpen = false,
  showBorderTop = false,
  className = ""
}: SaveFileProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [selected, setSelected] = useState<string | null>(selectedOption ?? null)

  // Sync with props
  useEffect(() => {
    setSelected(selectedOption ?? null)
  }, [selectedOption])

  const handleFileTypeSelect = (option: string) => {
    setSelected(option)
    if (onSaveFileTypeSelect) {
      onSaveFileTypeSelect(option)
    }
    // Close dropdown after selection for better UX
    setIsOpen(false)
  }

  return (
    <div className={className}>
      {showBorderTop && <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>}

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
        <div className="space-y-2 md:space-y-2 mb-4 px-2 md:px-6">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full px-3 py-2 md:p-3 rounded-lg text-left text-white text-sm md:text-md transition-all duration-200 ${
                selected === option
                   ? "bg-white/10 border-2 border-[#6C3BFF]"
                  : "bg-white/10 hover:bg-[#3A3A3A] border-2 border-transparent"
              }`}
              onClick={() => handleFileTypeSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 