"use client"

import { ReactNode } from "react"
import { X } from "lucide-react"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export default function SettingsPanel({
  isOpen,
  onClose,
  title = "Settings",
  children,
  className = ""
}: SettingsPanelProps) {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 ${className}`}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1A1A1A] border-l border-white/10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-[#1A1A1A] z-10">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
