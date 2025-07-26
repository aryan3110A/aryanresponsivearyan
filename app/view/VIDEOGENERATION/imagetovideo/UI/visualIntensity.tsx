"use client"

import { Minus, Plus } from "lucide-react"

interface VisualIntensityProps {
  visualIntensity: number
  setVisualIntensity: (value: number) => void
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
}

export default function VisualIntensity({
  visualIntensity,
  setVisualIntensity,
  isEnabled,
  setIsEnabled,
}: VisualIntensityProps) {
  const handleDecrease = () => {
    const newValue = Math.max(0, visualIntensity - 0.1)
    setVisualIntensity(Math.round(newValue * 10) / 10)
  }

  const handleIncrease = () => {
    const newValue = Math.min(2, visualIntensity + 0.1)
    setVisualIntensity(Math.round(newValue * 10) / 10)
  }

  return (
    <div className="px-2 md:px-6 mb-6">
      {/* Header with title and toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg md:text-xl font-medium">Visual intensity</h3>
        <button
          className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${
            isEnabled ? "bg-[#6C3BFF]" : "bg-white"
          }`}
          onClick={() => setIsEnabled(!isEnabled)}
          aria-label="Toggle Visual Intensity"
        >
          <span
            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-black rounded-full shadow-md transform transition-transform duration-200 ${
              isEnabled ? "translate-x-6 " : ""
            }`}
          />
        </button>
      </div>

      {/* Control buttons without slider */}
      {isEnabled && (
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4">
          {/* Minus Button */}
          <button
            onClick={handleDecrease}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
            disabled={visualIntensity <= 0}
          >
            <Minus className="w-5 h-5" />
          </button>

          {/* Value Display */}
          <div className="flex-1 text-center">
            <span className="text-white text-lg font-medium">{visualIntensity.toFixed(1)}</span>
          </div>

          {/* Plus Button */}
          <button
            onClick={handleIncrease}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-600/50 rounded-lg transition-colors duration-200"
            disabled={visualIntensity >= 2}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
