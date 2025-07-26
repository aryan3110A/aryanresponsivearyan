"use client"

import * as React from "react"
import { useState } from "react"
import { ChevronDown } from 'lucide-react'
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandYoutube,
} from "@tabler/icons-react"

interface AspectRatioOption {
  label: string
  icon: string | React.JSX.Element
  id: string
}

interface AspectRatioProps {
  onAspectRatioSelect?: (ratio: string) => void
  selectedAspectRatio?: string
  title?: string
  ratios?: AspectRatioOption[]
  className?: string
}

export default function AspectRatio({ 
  onAspectRatioSelect, 
  selectedAspectRatio = "1:1",
  title = "Aspect ratio",
  ratios = [
    { id: "1:1", label: "1:1", icon: "⬜" },
    { id: "2:3", label: "2:3", icon: "▬" },
    { id: "16:9", label: "16:9", icon: "▭" },
    { id: "custom", label: "Custom", icon: "⚏" },
    { id: "instagram-profile", label: "Profile", icon: <IconBrandInstagram size={20} className="text-purple-500" /> },
    { id: "instagram-post", label: "Post", icon: <IconBrandInstagram size={20} className="text-purple-500" /> },
    { id: "linkedin-profile", label: "Profile", icon: <IconBrandLinkedin size={20} className="text-blue-500" /> },
    { id: "linkedin-post", label: "Post", icon: <IconBrandLinkedin size={20} className="text-blue-500" /> },
    { id: "facebook-profile", label: "Profile", icon: <IconBrandFacebook size={20} className="text-blue-600" /> },
    { id: "facebook-post", label: "Post", icon: <IconBrandFacebook size={20} className="text-blue-600" /> },
    { id: "youtube-profile", label: "Profile", icon: <IconBrandYoutube size={20} className="text-red-500" /> },
    { id: "youtube-video", label: "Video", icon: <IconBrandYoutube size={20} className="text-red-500" /> }
  ],
  className = ""
}: AspectRatioProps) {
  const [selected, setSelected] = useState<string>(selectedAspectRatio)
  const [isOpen, setIsOpen] = useState(true)

  const handleSelect = (ratioId: string) => {
    setSelected(ratioId)
    if (onAspectRatioSelect) {
      onAspectRatioSelect(ratioId)
    }
  }

  return (
    <div className={className}>
      <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>
      
      {/* Header with dropdown */}
      <div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-xl font-medium">{title}</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Grid of aspect ratio options */}
      {isOpen && (
        <div className="grid grid-cols-4 gap-2 md:gap-4 px-2 md:px-6">
          {ratios.map((ratio) => (
            <button
              key={ratio.id}
              className={`h-[60px] border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                selected === ratio.id 
                ? "border-[#6C3BFF] text-white bg-white/10" 
                : "text-gray-300 border border-none bg-white/10 backdrop-blur-3xl hover:border-[#6C3BFF] hover:text-white"
              }`}
              onClick={() => handleSelect(ratio.id)}
            >
              <div className="text-lg mb-1 flex items-center justify-center">
                {typeof ratio.icon === 'string' ? ratio.icon : ratio.icon}
              </div>
              <span className="text-xs md:text-sm font-medium">{ratio.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
