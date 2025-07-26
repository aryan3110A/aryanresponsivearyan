"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import {
  cameraAngles as CameraAngle,
  effects as Effects,
  Expression,
  Timeline,
  AspectRatio,
  FPS,
  Quality,
  PrivateMode,
  AddToCollection,
  AdvanceSettingPanel,
  ResetToDefaults,
  promptEnhancer as PromptEnhancer
} from "../UI"

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
  // State for the components
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<string | null>(null)
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)
  const [customEffect, setCustomEffect] = useState<string>("")
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null)
  const [customExpression, setCustomExpression] = useState<string>("")
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null)
  const [customTimeline, setCustomTimeline] = useState<string>("")
  const [selectedFPS, setSelectedFPS] = useState<string | null>(null)
  const [customFPS, setCustomFPS] = useState<string>("")
  const [selectedSaveAs, setSelectedSaveAs] = useState("MP4")
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(true)
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
    setSelectedFPS(null)
    setCustomFPS("")
    setSelectedSaveAs("MP4")
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

  const handleSave = () => {
    console.log("Settings saved:", {
      model: selectedModel,
      cameraAngle: selectedCameraAngle,
      effect: selectedEffect,
      expression: selectedExpression,
      timeline: selectedTimeline,
      aspectRatio: selectedAspectRatio,
      fps: selectedFPS,
      saveAs: selectedSaveAs,
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

            {/* FPS Section */}
            <div className="mb-6">
              <FPS
                onFPSSelect={setSelectedFPS}
                selectedFPS={selectedFPS}
                customFPS={customFPS}
                setCustomFPS={setCustomFPS}
              />
            </div>

            {/* Save As Section */}
            <div className="mb-6">
              <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>
              <div className="flex items-center justify-between mb-4 px-2 md:px-6">
                <h3 className="text-white text-lg md:text-xl font-medium">Save as</h3>
                <button
                  onClick={() => setIsSaveAsOpen(!isSaveAsOpen)}
                  className="p-1"
                >
                  <ChevronDown className={`text-white h-5 w-5 transition-transform ${isSaveAsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              {isSaveAsOpen && (
                <div className="space-y-2 mb-4 px-2 md:px-6">
                  {["MP4", "WebM", "GIF", "MOV", "AVI"].map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedSaveAs(format)}
                      className={`w-full p-3 rounded-lg text-left text-white text-sm md:text-base transition-all duration-200 flex items-center justify-between ${
                        selectedSaveAs === format
                          ? "bg-white/10 border-2 border-[#6C3BFF]"
                          : "bg-white/10 hover:bg-[#3A3A3A] border-2 border-transparent"
                      }`}
                    >
                      <span>{format}</span>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedSaveAs === format 
                          ? "border-[#6C3BFF] bg-[#6C3BFF]" 
                          : "border-gray-400"
                      }`}>
                        {selectedSaveAs === format && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
            </div>

              
            {/* Summary Section */}
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                <div className="text-white font-medium mb-3">Settings Summary</div>
                <div>Camera Angle : <span className="text-[#5AD7FF]">{selectedCameraAngle || "None"}</span></div>
                <div>Selected Effect : <span className="text-[#5AD7FF]">{selectedEffect || customEffect || "None"}</span></div>
                <div>Expression : <span className="text-[#5AD7FF]">{selectedExpression || customExpression || "None"}</span></div>
                <div>Timeline : <span className="text-[#5AD7FF]">{selectedTimeline || customTimeline || "None"}</span></div>
                <div>Aspect Ratio : <span className="text-[#5AD7FF]">{selectedAspectRatio || "None"}</span></div>
                <div>FPS : <span className="text-[#5AD7FF]">{selectedFPS || customFPS || "None"}</span></div>
                <div>Save As : <span className="text-[#5AD7FF]">{selectedSaveAs}</span></div>
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








