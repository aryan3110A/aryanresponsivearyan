"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown, Upload } from "lucide-react"

interface SelectBackgroundPanelProps {
  backgrounds: { src: string; label: string }[]
  selectedBackground: string
  setSelectedBackground: (src: string) => void
  onUpload: (file: File) => void
}

export default function SelectBackgroundPanel({
  backgrounds,
  selectedBackground,
  setSelectedBackground,
  onUpload,
}: SelectBackgroundPanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">Select Background</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isOpen && (
        <div className="space-y-4 mb-4 px-2 md:px-6">
          <div className="flex flex-wrap gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.src}
                className={`p-1 rounded-lg border-2 ${selectedBackground === bg.src ? "border-[#6C3BFF]" : "border-transparent"}`}
                onClick={() => setSelectedBackground(bg.src)}
              >
                <Image src={bg.src} alt={bg.label} width={48} height={48} className="rounded-md" />
                <div className="text-xs text-white mt-1 text-center">{bg.label}</div>
              </button>
            ))}
            <label className="flex flex-col items-center justify-center cursor-pointer p-2 border-2 border-dashed border-gray-400 rounded-lg">
              <Upload className="w-6 h-6 text-white mb-1" />
              <span className="text-xs text-white">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      )}
    </div>
  )
} 