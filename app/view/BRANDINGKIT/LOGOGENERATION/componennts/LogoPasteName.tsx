"use client"

import { useState } from "react"
import { ChevronDown } from 'lucide-react'

interface LogoPasteNameProps {
  logoName: string
  setLogoName: (name: string) => void
}

export default function LogoPasteName({
  logoName,
  setLogoName,
}: LogoPasteNameProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
<div><div className="mx-2 md:mx-6 border-t border-white/15 mb-2 "></div>
<div className="flex items-center justify-between mb-4 px-2 md:px-6">
        <h3 className="text-white text-lg md:text-lg font-medium">Logo Paste Name</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1"
        >
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isOpen && (
        <div className="mb-4 px-2 md:px-6">
          <input
            type="text"
            placeholder="Paste or type logo name..."
            value={logoName}
            onChange={e => setLogoName(e.target.value)}
            className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#6C3BFF]"
          />
        </div>
      )}
    </div>
  )
} 