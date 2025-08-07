"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { VIDEO_MODELS, getAvailableDurations, getModelType, getSupportedAspectRatios, getAvailableQualities } from "./videoModels"
import TextToVideoInput from "./TextToVideoInput"
import ImageToVideoInput from "./ImageToVideoInput"
import SubjectReferenceInput from "./SubjectReferenceInput"

interface VideoSettingsProps {
  selectedModel: string
  setSelectedModel: (model: string) => void
  selectedDuration: number
  setSelectedDuration: (duration: number) => void
  selectedCameraMovements: string[]
  setSelectedCameraMovements: (movements: string[]) => void
  firstFrameImage: string | null
  setFirstFrameImage: (image: string | null) => void
  subjectImage: string | null
  setSubjectImage: (image: string | null) => void
  selectedAspectRatio: string
  setSelectedAspectRatio: (ratio: string) => void
  selectedQuality: string
  setSelectedQuality: (quality: string) => void
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
  subjectImage,
  setSubjectImage,
  selectedAspectRatio,
  setSelectedAspectRatio,
  selectedQuality,
  setSelectedQuality,
  resolution
}: VideoSettingsProps) {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false)

  const currentModel = VIDEO_MODELS.find(m => m.id === selectedModel)
  const availableDurations = getAvailableDurations(selectedModel, resolution)
  const modelType = getModelType(selectedModel)

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    setIsModelDropdownOpen(false)

    // Validate and reset aspect ratio if not supported by new model
    const supportedAspectRatios = getSupportedAspectRatios(modelId)
    if (!supportedAspectRatios.includes(selectedAspectRatio)) {
      setSelectedAspectRatio(supportedAspectRatios[0])
    }

    // Validate and reset quality if not supported by new model and aspect ratio
    const availableQualities = getAvailableQualities(modelId, selectedAspectRatio)
    if (!availableQualities.includes(selectedQuality)) {
      setSelectedQuality(availableQualities[0])
    }

    // Reset duration to first available option for new model
    const newDurations = getAvailableDurations(modelId, resolution)
    if (!newDurations.includes(selectedDuration)) {
      setSelectedDuration(newDurations[0])
    }

    // Handle model-specific data when switching models
    const newModelType = getModelType(modelId)
    const currentModelType = getModelType(selectedModel)

    if (newModelType !== currentModelType) {
      setSelectedCameraMovements([])

      // Transfer images between model types if needed
      console.log('=== MODEL SWITCH DEBUG ===')
      console.log('Current Model Type:', currentModelType)
      console.log('New Model Type:', newModelType)
      console.log('FirstFrame Image exists:', !!firstFrameImage)
      console.log('Subject Image exists:', !!subjectImage)
      console.log('========================')

      if (newModelType === 'subject-reference') {
        // Moving to S2V-01 - ensure we have an image in subjectImage
        if (firstFrameImage && !subjectImage) {
          console.log('✅ Transferring firstFrameImage to subjectImage for S2V-01')
          setSubjectImage(firstFrameImage)
          setFirstFrameImage(null)
        } else if (!subjectImage && !firstFrameImage) {
          console.log('⚠️ No image available when switching to S2V-01')
        } else if (subjectImage) {
          console.log('✅ S2V-01 already has subjectImage')
        }
      } else if (currentModelType === 'subject-reference') {
        // Moving from S2V-01 - transfer subjectImage to firstFrameImage if needed
        if (subjectImage && !firstFrameImage) {
          console.log('✅ Transferring subjectImage to firstFrameImage')
          setFirstFrameImage(subjectImage)
          setSubjectImage(null)
        }
      }
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
            <div className="w-auto  absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-auto overflow-y-auto">
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

      {/* Duration Selection using Timeline component */}
      <div className="space-y-3">
        <label className="text-white font-medium">Duration</label>
        <div className="relative">
          <button
            onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
          >
            <span>{selectedDuration} seconds</span>
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

      {/* Model-Specific Input Components */}
      <div>
        <h3 className="text-white font-medium mb-4">Input Configuration</h3>
        {modelType === 'text-to-video' && (
          <TextToVideoInput
            selectedModel={selectedModel}
            selectedCameraMovements={selectedCameraMovements}
            setSelectedCameraMovements={setSelectedCameraMovements}
          />
        )}

        {modelType === 'image-to-video' && (
          <ImageToVideoInput
            selectedModel={selectedModel}
            firstFrameImage={firstFrameImage}
            selectedCameraMovements={selectedCameraMovements}
            setSelectedCameraMovements={setSelectedCameraMovements}
          />
        )}

        {modelType === 'subject-reference' && (
          <SubjectReferenceInput
            subjectImage={subjectImage}
          />
        )}
      </div>
    </div>
  )
}
