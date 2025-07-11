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
    <div className="mb-6 px-2 md:px-6">
      <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] text-white font-semibold text-lg transition-all"
        onClick={onClick}>
        Save
        <span className="flex items-center ml-2 text-base font-medium">
          (
          <Image src="/BRANDINGKIT/PRODUCTGENERATION/coins.svg" alt="Tokens" width={24} height={24} className="mx-1" />
          100
          )
        </span>
        {children}
      </button>
    </div>
  )
} 