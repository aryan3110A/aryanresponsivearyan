"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, FolderOpen, Upload } from "lucide-react"

interface AttachmentsDropdownProps {
  onChooseFromLibrary: () => void
  onUploadFromDevices: () => void
  className?: string
}

export default function AttachmentsDropdown({ 
  onChooseFromLibrary, 
  onUploadFromDevices,
  className = ""
}: AttachmentsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleChooseFromLibrary = () => {
    onChooseFromLibrary()
    setIsOpen(false)
  }

  const handleUploadFromDevices = () => {
    onUploadFromDevices()
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Plus Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-12 left-0 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-lg z-10 min-w-[200px]"
        >
          <div className="p-2">
            <button
              onClick={handleChooseFromLibrary}
              className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="text-sm">Choose from library</span>
            </button>
            <button
              onClick={handleUploadFromDevices}
              className="w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload from devices</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
