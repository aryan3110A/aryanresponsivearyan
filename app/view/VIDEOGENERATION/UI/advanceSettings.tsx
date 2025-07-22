"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface AdvanceSettingPanelProps {
  photoReal: boolean
  setPhotoReal: (v: boolean) => void
  negativePrompt: boolean
  setNegativePrompt: (v: boolean) => void
  transparency: boolean
  setTransparency: (v: boolean) => void
  tiling: boolean
  setTiling: (v: boolean) => void
  fixedSeed: boolean
  setFixedSeed: (v: boolean) => void
}

export default function AdvanceSettingPanel({
  photoReal,
  setPhotoReal,
  negativePrompt,
  setNegativePrompt,
  transparency,
  setTransparency,
  tiling,
  setTiling,
  fixedSeed,
  setFixedSeed,
}: AdvanceSettingPanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
<div><div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>
<div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">Advance Setting</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isOpen && (
        <div className="space-y-3 w-full min-w-full mb-4 px-2 md:px-6">
          <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
            <span className="text-white text-base">Photo Real</span>
            <button
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${photoReal ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
              onClick={() => setPhotoReal(!photoReal)}
              aria-label="Toggle Photo Real"
            >
              <span className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${photoReal ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
            <span className="text-white text-base">Negative Prompt</span>
            <button
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${negativePrompt ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
              onClick={() => setNegativePrompt(!negativePrompt)}
              aria-label="Toggle Negative Prompt"
            >
              <span className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${negativePrompt ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
            <span className="text-white text-base">Transparency</span>
            <button
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${transparency ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
              onClick={() => setTransparency(!transparency)}
              aria-label="Toggle Transparency"
            >
              <span className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${transparency ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
            <span className="text-white text-base">Tilling</span>
            <button
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${tiling ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
              onClick={() => setTiling(!tiling)}
              aria-label="Toggle Tilling"
            >
              <span className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${tiling ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <div className="flex items-center justify-between w-full bg-white/5 rounded-lg px-4 py-3">
            <span className="text-white text-base">Use Fixed Seed</span>
            <button
              className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${fixedSeed ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
              onClick={() => setFixedSeed(!fixedSeed)}
              aria-label="Toggle Use Fixed Seed"
            >
              <span className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${fixedSeed ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 