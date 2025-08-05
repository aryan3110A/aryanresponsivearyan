"use client"

import Image from "next/image"
import { ReactNode } from "react"

interface SaveButtonProps {
  onClick: () => void
  showSummary: boolean
  children?: ReactNode
}

export default function SaveButton({ onClick, children }: SaveButtonProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
      <button
        onClick={onClick}
        className="w-32 bg-[#006aff] hover:bg-[#0052cc] text-white py-3 px-6 rounded-full font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2"
      >
        Save
        <span className="flex items-center ml-1 text-xs">
          (
          <Image src="/BRANDINGKIT/PRODUCTGENERATION/coins.svg" alt="Tokens" width={16} height={16} className="mx-1" />
          100
          )
        </span>
        {children}
      </button>
    </div>
  )
} 