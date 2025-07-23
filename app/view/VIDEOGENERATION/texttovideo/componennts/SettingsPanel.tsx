"use client"

import { useState, useRef } from "react"
import { X, ChevronDown } from "lucide-react"
import {
  ModelsPresetPanel,
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

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  selectedAspectRatio: string
  setSelectedAspectRatio: (ratio: string) => void
  selectedQuality: string
  setSelectedQuality: (quality: string) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  selectedModel,
  setSelectedModel,
  selectedAspectRatio,
  setSelectedAspectRatio,
  selectedQuality,
  setSelectedQuality,
}: SettingsPanelProps) {
  // State for ModelsPresetPanel
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

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
    setIsModelsOpen(false)
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
    setSelectedAspectRatio("")
    setSelectedQuality("")
    setPromptEnhance("Auto")
  }

  const toggleModels = () => {
    setIsModelsOpen((prev) => !prev)
  }

  const handleModelSelect = (model: string) => {
    setSelectedModel(model)
    setIsModelsOpen(false) // Close the models panel after selection
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
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Settings Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] md:w-[560px] bg-transparent backdrop-blur-lg shadow-3xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide pb-6">
            <style jsx>{`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Model & Preset Section */}
            <div className="relative">
              <button
                ref={toggleButtonRef}
                onClick={toggleModels}
                className="px-6 md:px-10 w-full py-6 md:py-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-white/10 cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all mb-4 text-left relative overflow-hidden"
                style={{
                  backgroundImage: "url('/placeholder.svg?height=80&width=400')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg md:text-xl font-bold">
                      Model & <span className="text-[#6C3BFF]">Preset</span>
                    </h3>
                  </div>
                  <ChevronDown
                    className={`text-white text-xl md:text-3xl transition-transform duration-300 ${
                      isModelsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Models Dropdown for Mobile/Tablet */}
              <div className="md:hidden">
                <ModelsPresetPanel
                  isOpen={isModelsOpen}
                  onClose={() => setIsModelsOpen(false)}
                  selectedModel={selectedModel}
                  onModelSelect={handleModelSelect}
                  excludeRef={toggleButtonRef}
                />
              </div>

              {/* Models Dropdown for Desktop */}
              <div className="hidden md:block">
                <ModelsPresetPanel
                  isOpen={isModelsOpen}
                  onClose={() => setIsModelsOpen(false)}
                  selectedModel={selectedModel}
                  onModelSelect={handleModelSelect}
                  excludeRef={toggleButtonRef}
                />
              </div>
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
              <AspectRatio onAspectRatioSelect={setSelectedAspectRatio} selectedAspectRatio={selectedAspectRatio} />
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
              <Quality onQualitySelect={setSelectedQuality} selectedQuality={selectedQuality} />
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

            {/* Save Button */}
            <div className="mb-6 px-2 md:px-6">
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] text-white py-4 rounded-lg font-medium text-lg transition-all"
              >
                Save
              </button>
              {/* Settings Summary */}
              <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-6">
                <div className="text-white font-medium mb-3">Settings Summary</div>
                <div>Model Selection : <span className="text-[#5AD7FF]">{selectedModel}</span></div>
                <div>Camera Angle : <span className="text-[#5AD7FF]">{selectedCameraAngle || "None"}</span></div>
                <div>Selected Effect : <span className="text-[#5AD7FF]">{selectedEffect || customEffect || "None"}</span></div>
                <div>Expression : <span className="text-[#5AD7FF]">{selectedExpression || customExpression || "None"}</span></div>
                <div>Timeline : <span className="text-[#5AD7FF]">{selectedTimeline || customTimeline || "None"}</span></div>
                <div>Aspect Ratio : <span className="text-[#5AD7FF]">{selectedAspectRatio || "None"}</span></div>
                <div>Social Platform : <span className="text-[#5AD7FF]">{selectedSocialPlatform || "None"}</span></div>
                <div>Social Format : <span className="text-[#5AD7FF]">{selectedSocialFormat || "None"}</span></div>
                <div>FPS : <span className="text-[#5AD7FF]">{selectedFPS || customFPS || "None"}</span></div>
                <div>Quality : <span className="text-[#5AD7FF]">{selectedQuality || "None"}</span></div>
                <div>Private Mode : <span className="text-[#5AD7FF]">{privateMode ? "Enabled" : "Disabled"}</span></div>
                <div>Prompt Enhancer : <span className="text-[#5AD7FF]">{promptEnhance}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </>
  )
}
