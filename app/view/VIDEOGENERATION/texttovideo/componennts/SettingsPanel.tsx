"use client"

import { useState } from "react"
import React from "react"
import {
  cameraAngles as CameraAngle,
  effects as Effects,
  Expression,
  Timeline,
  AspectRatio,
  SocialMedia,
  FPS,
  Quality,
  PrivateMode,
  AddToCollection,
  AdvanceSettingPanel,
  ResetToDefaults,
  promptEnhancer as PromptEnhancer
} from "../../UI"
import VideoSettings from "./VideoSettings"
import { getApiResolution, getSupportedAspectRatios, getAvailableQualities } from "./videoModels"

interface SettingsPanelProps {
  onClose: () => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  selectedAspectRatio: string
  setSelectedAspectRatio: (ratio: string) => void
  selectedQuality: string
  setSelectedQuality: (quality: string) => void
  selectedDuration: number
  setSelectedDuration: (duration: number) => void
  selectedCameraMovements: string[]
  setSelectedCameraMovements: (movements: string[]) => void
  firstFrameImage: string | null
  setFirstFrameImage: (image: string | null) => void
  subjectImage: string | null
  setSubjectImage: (image: string | null) => void
  className?: string
}

export default function SettingsPanel({
  onClose,
  selectedModel,
  setSelectedModel,
  selectedAspectRatio,
  setSelectedAspectRatio,
  selectedQuality,
  setSelectedQuality,
  selectedDuration,
  setSelectedDuration,
  selectedCameraMovements,
  setSelectedCameraMovements,
  firstFrameImage,
  setFirstFrameImage,
  subjectImage,
  setSubjectImage,
  className,
}: SettingsPanelProps) {


  // State for the components you requested
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<string | null>(null)
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)
  const [customEffect, setCustomEffect] = useState<string>("")
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null)
  const [customExpression, setCustomExpression] = useState<string>("")
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null)
  const [customTimeline, setCustomTimeline] = useState<string>("")
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<string | null>(null)
  const [selectedSocialFormat, setSelectedSocialFormat] = useState<string | null>(null)
  const [selectedFPS, setSelectedFPS] = useState<string | null>(null)
  const [customFPS, setCustomFPS] = useState<string>("")
  const [privateMode, setPrivateMode] = useState(false)
  const [collections, setCollections] = useState<string[]>([])
  const [isCollectionOpen, setIsCollectionOpen] = useState(false)
  const [photoReal, setPhotoReal] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState(false)
  const [transparency, setTransparency] = useState(false)
  const [tiling, setTiling] = useState(false)
  const [fixedSeed, setFixedSeed] = useState(false)
  const [promptEnhance, setPromptEnhance] = useState("Auto")

  const handleReset = () => {
    setSelectedCameraAngle(null)
    setSelectedEffect(null)
    setCustomEffect("")
    setSelectedExpression(null)
    setCustomExpression("")
    setSelectedTimeline(null)
    setCustomTimeline("")
    setSelectedSocialPlatform(null)
    setSelectedSocialFormat(null)
    setSelectedFPS(null)
    setCustomFPS("")
    setPrivateMode(false)
    setCollections([])
    setIsCollectionOpen(false)
    setPhotoReal(false)
    setNegativePrompt(false)
    setTransparency(false)
    setTiling(false)
    setFixedSeed(false)
    setSelectedAspectRatio("16:9")
    setSelectedQuality("HD")
    setPromptEnhance("Auto")
    // Reset video-specific settings
    setSelectedModel("MiniMax-Hailuo-02")
    setSelectedDuration(6)
    setSelectedCameraMovements([])
    setFirstFrameImage(null)
  }



  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", {
      model: selectedModel,
      cameraAngle: selectedCameraAngle,
      effect: selectedEffect,
      expression: selectedExpression,
      timeline: selectedTimeline,
      aspectRatio: selectedAspectRatio,
      socialPlatform: selectedSocialPlatform,
      socialFormat: selectedSocialFormat,
      fps: selectedFPS,
      quality: selectedQuality,
      privateMode: privateMode,
      promptEnhance: promptEnhance,
    })
    onClose()
  }

  return (
    <>
      <div className={`sticky top-[64px] left-0 w-[340px] max-h-[calc(100vh-128px)] overflow-y-auto bg-transparent backdrop-blur-lg shadow-3xl z-30 border-r border-[#222] ${className || ''}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-white text-sm font-normal">Settings</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide pb-24">
            <style jsx>{`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Video Settings Section */}
            <div className="mb-6">
              <h3 className="text-white text-sm font-normal mb-4">
                Video <span className="text-[#6C3BFF]">Settings</span>
              </h3>
              <VideoSettings
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                selectedCameraMovements={selectedCameraMovements}
                setSelectedCameraMovements={setSelectedCameraMovements}
                firstFrameImage={firstFrameImage}
                setFirstFrameImage={setFirstFrameImage}
                subjectImage={subjectImage}
                setSubjectImage={setSubjectImage}
                selectedAspectRatio={selectedAspectRatio}
                setSelectedAspectRatio={setSelectedAspectRatio}
                selectedQuality={selectedQuality}
                setSelectedQuality={setSelectedQuality}
                resolution={getApiResolution(selectedModel, selectedQuality, selectedAspectRatio)}
              />
            </div>

            {/* Camera Angle Section */}
            <div className="mb-6">
              <CameraAngle
                onCameraAngleSelect={setSelectedCameraAngle}
                selectedCameraAngle={selectedCameraAngle}
              />
            </div>

            {/* Effects Section */}
            <div className="mb-6">
              <Effects
                onEffectSelect={setSelectedEffect}
                selectedEffect={selectedEffect}
                customEffect={customEffect}
                setCustomEffect={setCustomEffect}
              />
            </div>

            {/* Expressions Section */}
            <div className="mb-6">
              <Expression
                onExpressionSelect={setSelectedExpression}
                selectedExpression={selectedExpression}
                customExpression={customExpression}
                setCustomExpression={setCustomExpression}
              />
            </div>

            {/* Timeline Section */}
            <div className="mb-6">
              <Timeline
                onTimelineSelect={setSelectedTimeline}
                selectedTimeline={selectedTimeline}
                customTimeline={customTimeline}
                setCustomTimeline={setCustomTimeline}
              />
            </div>

            {/* Aspect Ratio Section */}
            <div className="mb-6">
              <AspectRatio
                onAspectRatioSelect={setSelectedAspectRatio}
                selectedAspectRatio={selectedAspectRatio}
                ratios={getSupportedAspectRatios(selectedModel).map(ratio => ({
                  label: ratio,
                  icon: ratio === "1:1" ? "⬜" : ratio === "16:9" ? "▭" : ratio === "9:16" ? "▬" : "⚏"
                }))}
              />
            </div>

            {/* Social Media Frame Section */}
            <div className="mb-6">
              <SocialMedia
                selectedPlatform={selectedSocialPlatform}
                selectedFormat={selectedSocialFormat}
                onPlatformSelect={setSelectedSocialPlatform}
                onFormatSelect={setSelectedSocialFormat}
              />
            </div>

            {/* FPS Section */}
            <div className="mb-6">
              <FPS
                onFPSSelect={setSelectedFPS}
                selectedFPS={selectedFPS}
                customFPS={customFPS}
                setCustomFPS={setCustomFPS}
              />
            </div>
         
            {/* Quality Section */}
            <div className="mb-6">
              <Quality
                onQualitySelect={setSelectedQuality}
                selectedQuality={selectedQuality}
                qualities={getAvailableQualities(selectedModel, selectedAspectRatio)}
                title="Video Quality"
              />
            </div>

            {/* Private Mode Section */}
            <div className="mb-6">
              <PrivateMode
                privateMode={privateMode}
                setPrivateMode={setPrivateMode}
              />
            </div>

            {/* Add to Collection Section */}
            <div className="mb-6">
              <AddToCollection
                collections={collections}
                setCollections={setCollections}
                isCollectionOpen={isCollectionOpen}
                setIsCollectionOpen={setIsCollectionOpen}
              />
            </div>

            {/* Advanced Settings Section */}
            <div className="mb-6">
              <AdvanceSettingPanel
                photoReal={photoReal}
                setPhotoReal={setPhotoReal}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                transparency={transparency}
                setTransparency={setTransparency}
                tiling={tiling}
                setTiling={setTiling}
                fixedSeed={fixedSeed}
                setFixedSeed={setFixedSeed}
              />
            </div>

            {/* Reset to Defaults Section */}
            <div className="mb-6">
              <ResetToDefaults onReset={handleReset} />
            </div>

            {/* Prompt Enhancer Section */}
            <div className="mb-6">
              <PromptEnhancer
                promptEnhance={promptEnhance}
                setPromptEnhance={setPromptEnhance}
              />
            </div>

            {/* Settings Summary */}
            <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mb-6">
              <div className="text-white font-normal text-sm mb-3">Video Settings Summary</div>
              <div>Model : <span className="text-[#5AD7FF]">{selectedModel}</span></div>
              <div>Duration : <span className="text-[#5AD7FF]">{selectedDuration}s</span></div>
              <div>Aspect Ratio : <span className="text-[#5AD7FF]">{selectedAspectRatio}</span></div>
              <div>Quality : <span className="text-[#5AD7FF]">{selectedQuality}</span></div>
              <div>Camera Movements : <span className="text-[#5AD7FF]">{selectedCameraMovements.length > 0 ? `${selectedCameraMovements.length} selected` : "None"}</span></div>
              <div>First Frame Image : <span className="text-[#5AD7FF]">{firstFrameImage ? "Uploaded" : "None"}</span></div>
              <div>Private Mode : <span className="text-[#5AD7FF]">{privateMode ? "Enabled" : "Disabled"}</span></div>
              <div>Prompt Enhancer : <span className="text-[#5AD7FF]">{promptEnhance}</span></div>
            </div>
          </div>

          {/* Floating Save Button */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center z-50">
            <button
              onClick={handleSave}
              className="w-32 bg-[#006aff] hover:bg-[#0052cc] text-white py-3 px-6 rounded-full font-normal text-sm transition-all shadow-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>

    </>
  )
}
