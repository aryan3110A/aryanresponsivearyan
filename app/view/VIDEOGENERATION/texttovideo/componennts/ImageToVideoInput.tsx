"use client"

import { useState } from "react"
import { Upload, X, ChevronDown } from "lucide-react"
import { CAMERA_MOVEMENTS, supportsCameraMovements } from "./videoModels"
import Image from "next/image"

interface ImageToVideoInputProps {
  selectedModel: string
  firstFrameImage: string | null
  selectedCameraMovements: string[]
  setSelectedCameraMovements: (movements: string[]) => void
}

export default function ImageToVideoInput({
  selectedModel,
  firstFrameImage,
  selectedCameraMovements,
  setSelectedCameraMovements
}: ImageToVideoInputProps) {
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
      {/* Image Display */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          First Frame Image <span className="text-red-400">*</span>
        </label>
        <div className="text-gray-400 text-xs mb-3">
          Upload an image using the attachment button in the main input field above
        </div>

        {!firstFrameImage ? (
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/30">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-400 text-sm">No image uploaded</span>
            <span className="text-gray-500 text-xs mt-1">Use the attachment button above to upload</span>
          </div>
        ) : (
          <div className="relative">
            <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={firstFrameImage}
                alt="First frame"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-green-400 text-sm">✓ Image uploaded successfully</span>
            </div>
          </div>
        )}
      </div>



      {/* Camera Movements (for Director models) */}
      {showCameraMovements && (
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Camera Movements (Optional)
          </label>
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
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                    >
                      {movement?.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips for Image-to-Video */}
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <h4 className="text-green-300 text-sm font-medium mb-2">Tips for better results:</h4>
        <ul className="text-green-200 text-xs space-y-1">
          <li>• Use high-quality, well-lit images for best results</li>
          <li>• Images with clear subjects work better than busy scenes</li>
          <li>• Describe how you want the image to animate or transform</li>
          <li>• Consider the composition and how elements should move</li>
        </ul>
      </div>
    </div>
  )
}
