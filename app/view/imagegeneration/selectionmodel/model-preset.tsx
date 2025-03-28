"use client"

import { ChevronRight } from "lucide-react"

interface ModelPresetProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function ModelPreset({ isOpen, toggle }: ModelPresetProps) {
  // Handle click to toggle the panel
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    toggle();
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden cursor-pointer w-[362px] h-[99px] flex items-center"
      onClick={handleClick}
      style={{
        backgroundImage: `url('/Rectangle39.png')`, // Ensure correct path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center relative">
        {/* Dark Overlay */}
        <div className="bg-[#292929]/95 w-[337px] h-[80px] flex flex-col justify-center px-4 rounded-[7px]">
          {/* Title (aligned to left by default) */}
          <p className="text-[20px] text-[#4B91F1] font-semibold ">Models/Preset</p>
          {/* Subtitle (aligned to left by default) */}
          <p className="text-white text-[16px]">Flux 1.0</p>
        </div>

        {/* Arrow Icon (centered with absolute positioning) */}
        <ChevronRight
          className={`absolute right-10 text-white transition-transform ${isOpen ? 'rotate-90' : ''}`} 
        />
      </div>
    </div>
  )
}
