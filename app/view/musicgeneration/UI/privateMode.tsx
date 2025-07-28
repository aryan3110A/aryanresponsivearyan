"use client"

import Image from "next/image"

interface PrivateModeProps {
  privateMode: boolean
  setPrivateMode: (v: boolean) => void
}

export default function PrivateMode({ privateMode, setPrivateMode }: PrivateModeProps) {
  return (
    <div className="mx-2 md:mx-6 border-t border-white/15 mb-6">
    <div className="flex items-center justify-between pt-6">
        

      <div className="flex items-center gap-2">
        <span className="text-white text-lg font-medium">Private Mode</span>
        <Image src="/BRANDINGKIT/PRODUCTGENERATION/Iicon.svg" alt="Info" width={18} height={18} />
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center">
          <Image src="/BRANDINGKIT/PRODUCTGENERATION/diamondicon.svg" alt="Premium" width={32} height={30} />
        </span>
        <button
          className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${privateMode ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
          onClick={() => setPrivateMode(!privateMode)}
          aria-label="Toggle Private Mode"
        >
          <span
            className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${privateMode ? 'translate-x-6' : ''}`}
          />
        </button>
      </div>
    </div></div>
  )
} 