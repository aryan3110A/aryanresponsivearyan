"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { CAMERA_MOVEMENTS, supportsCameraMovements } from "./videoModels"

interface TextToVideoInputProps {
  selectedModel: string
  selectedCameraMovements: string[]
  setSelectedCameraMovements: (movements: string[]) => void
}

export default function TextToVideoInput({
  selectedModel,
  selectedCameraMovements,
  setSelectedCameraMovements
}: TextToVideoInputProps) {
  const [isCameraDropdownOpen, setIsCameraDropdownOpen] = useState(false)
  const showCameraMovements = supportsCameraMovements(selectedModel)

  const handleCameraMovementToggle = (movementId: string) => {
    setSelectedCameraMovements(prev => {
      if (prev.includes(movementId)) {
        return prev.filter(id => id !== movementId)
      } else {
        // Limit to 3 camera movements as recommended
        if (prev.length >= 3) {
          return [...prev.slice(1), movementId]
        }
        return [...prev, movementId]
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Camera Movements (for Director models) */}
      {showCameraMovements && (
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Camera Movements (Optional)
          </label>
          <div className="text-gray-400 text-xs mb-3">
            Add camera movements to enhance your video with professional cinematography
          </div>
          <div className="relative">
            <button
              onClick={() => setIsCameraDropdownOpen(!isCameraDropdownOpen)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <span>
                {selectedCameraMovements.length > 0
                  ? `${selectedCameraMovements.length} movement(s) selected`
                  : "Select camera movements"}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isCameraDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCameraDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">
                    Select up to 3 camera movements
                  </div>
                  {CAMERA_MOVEMENTS.map((movement) => (
                    <label
                      key={movement.id}
                      className="flex items-center px-2 py-2 hover:bg-gray-700/50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCameraMovements.includes(movement.id)}
                        onChange={() => handleCameraMovementToggle(movement.id)}
                        className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <div>
                        <div className="text-white text-sm">{movement.name}</div>
                        <div className="text-gray-400 text-xs">{movement.instruction}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedCameraMovements.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-400 mb-1">Selected movements:</div>
              <div className="flex flex-wrap gap-2">
                {selectedCameraMovements.map((movementId) => {
                  const movement = CAMERA_MOVEMENTS.find(m => m.id === movementId)
                  return (
                    <span
                      key={movementId}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30 flex items-center"
                    >
                      {movement?.name}
                      <button
                        onClick={() => handleCameraMovementToggle(movementId)}
                        className="ml-1 text-purple-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips for Text-to-Video */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 text-sm font-medium mb-2">Tips for better results:</h4>
        <ul className="text-blue-200 text-xs space-y-1">
          <li>• Be specific about the scene, subjects, and actions</li>
          <li>• Include details about lighting, atmosphere, and mood</li>
          <li>• Specify camera angles if you want a particular perspective</li>
          <li>• Keep descriptions concise but detailed</li>
        </ul>
      </div>
    </div>
  )
}
