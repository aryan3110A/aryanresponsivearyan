"use client"

import { useState } from "react"
import { ChevronDown, Upload, X } from "lucide-react"
import { VIDEO_MODELS, CAMERA_MOVEMENTS, getAvailableDurations, supportsImageInput, supportsCameraMovements } from "./videoModels"

interface VideoSettingsProps {
  selectedModel: string
  setSelectedModel: (model: string) => void
  selectedDuration: number
  setSelectedDuration: (duration: number) => void
  selectedCameraMovements: string[]
  setSelectedCameraMovements: (movements: string[]) => void
  firstFrameImage: string | null
  setFirstFrameImage: (image: string | null) => void
  resolution: string
}

export default function VideoSettings({
  selectedModel,
  setSelectedModel,
  selectedDuration,
  setSelectedDuration,
  selectedCameraMovements,
  setSelectedCameraMovements,
  firstFrameImage,
  setFirstFrameImage,
  resolution
}: VideoSettingsProps) {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false)
  const [isCameraDropdownOpen, setIsCameraDropdownOpen] = useState(false)

  const currentModel = VIDEO_MODELS.find(m => m.id === selectedModel)
  const availableDurations = getAvailableDurations(selectedModel, resolution)
  const showImageUpload = supportsImageInput(selectedModel)
  const showCameraMovements = supportsCameraMovements(selectedModel)

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    setIsModelDropdownOpen(false)
    
    // Reset duration to first available option for new model
    const newDurations = getAvailableDurations(modelId, resolution)
    if (!newDurations.includes(selectedDuration)) {
      setSelectedDuration(newDurations[0])
    }
    
    // Clear camera movements if new model doesn't support them
    if (!supportsCameraMovements(modelId)) {
      setSelectedCameraMovements([])
    }
    
    // Clear first frame image if new model doesn't support it
    if (!supportsImageInput(modelId)) {
      setFirstFrameImage(null)
    }
  }

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFirstFrameImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-white font-medium">Video Model</label>
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <div>
              <div className="font-medium">{currentModel?.name}</div>
              <div className="text-sm text-gray-400">{currentModel?.description}</div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isModelDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {VIDEO_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                    selectedModel === model.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="font-medium text-white">{model.name}</div>
                  <div className="text-sm text-gray-400">{model.description}</div>
                  <div className="flex gap-2 mt-1">
                    {model.features.map((feature) => (
                      <span key={feature} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="space-y-3">
        <label className="text-white font-medium">Duration (seconds)</label>
        <div className="relative">
          <button
            onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <span>{selectedDuration}s</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isDurationDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDurationDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
              {availableDurations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    setSelectedDuration(duration)
                    setIsDurationDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-white ${
                    selectedDuration === duration ? 'bg-gray-700' : ''
                  }`}
                >
                  {duration} seconds
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* First Frame Image Upload (for I2V models) */}
      {showImageUpload && (
        <div className="space-y-3">
          <label className="text-white font-medium">First Frame Image (Optional)</label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="first-frame-upload"
            />
            <label
              htmlFor="first-frame-upload"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
            >
              {firstFrameImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={firstFrameImage}
                    alt="First frame"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setFirstFrameImage(null)
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Click to upload first frame image</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 20MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>
      )}

      {/* Camera Movements (for Director models) */}
      {showCameraMovements && (
        <div className="space-y-3">
          <label className="text-white font-medium">Camera Movements (Max 3)</label>
          <div className="relative">
            <button
              onClick={() => setIsCameraDropdownOpen(!isCameraDropdownOpen)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
            >
              <span>
                {selectedCameraMovements.length > 0 
                  ? `${selectedCameraMovements.length} movement(s) selected`
                  : 'Select camera movements'
                }
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isCameraDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCameraDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {CAMERA_MOVEMENTS.map((movement) => (
                  <button
                    key={movement.id}
                    onClick={() => handleCameraMovementToggle(movement.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between ${
                      selectedCameraMovements.includes(movement.id) ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{movement.name}</div>
                      <div className="text-sm text-gray-400">{movement.instruction}</div>
                    </div>
                    {selectedCameraMovements.includes(movement.id) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {selectedCameraMovements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCameraMovements.map((movementId) => {
                const movement = CAMERA_MOVEMENTS.find(m => m.id === movementId)
                return (
                  <span
                    key={movementId}
                    className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {movement?.name}
                    <button
                      onClick={() => handleCameraMovementToggle(movementId)}
                      className="hover:text-blue-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
