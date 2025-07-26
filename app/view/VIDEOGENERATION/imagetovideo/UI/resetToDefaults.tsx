"use client"

import Image from "next/image"

interface ResetToDefaultsProps {
  onReset: () => void
}

export default function ResetToDefaults({ onReset }: ResetToDefaultsProps) {
  return (
    <div className="mb-4 px-2 md:px-6">
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-base transition-all"
        onClick={onReset}>
        <Image src="/BRANDINGKIT/PRODUCTGENERATION/reply.svg" alt="Reset" width={22} height={22} />
        Reset to Defaults
      </button>
    </div>
  )
} 