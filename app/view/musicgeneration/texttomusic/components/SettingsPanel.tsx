"use client"

import { X, ChevronDown } from "lucide-react"
import {
  PrivateMode,
  AddToCollection,
  AdvanceSettingPanel,
  ResetToDefaults,
  promptEnhancer as PromptEnhancer
} from "../../UI"
import { useState, useEffect } from "react"
import Image from "next/image"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  sampleRate: number
  setSampleRate: (rate: number) => void
  bitrate: number
  setBitrate: (rate: number) => void
  audioFormat: string
  setAudioFormat: (format: string) => void
  promptEnhance: string
  setPromptEnhance: (value: string) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  selectedModel,
  setSelectedModel,
  sampleRate,
  setSampleRate,
  bitrate,
  setBitrate,
  audioFormat,
  setAudioFormat,
  promptEnhance,
  setPromptEnhance,
}: SettingsPanelProps) {
  // State for music generation settings
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);

  // Debug: Log whenever selectedModel changes
  console.log("SettingsPanel render - selectedModel:", selectedModel);

  useEffect(() => {
    console.log("SettingsPanel useEffect - selectedModel changed to:", selectedModel);
  }, [selectedModel]);

  const handleReset = () => {
    setIsModelsOpen(false);
    setPrivateMode(false);
    setCollections([]);
    setIsCollectionOpen(false);
    setPhotoReal(false);
    setNegativePrompt(false);
    setTransparency(false);
    setTiling(false);
    setFixedSeed(false);
    setSelectedModel("music-1.5");
    setSampleRate(44100);
    setBitrate(256000);
    setAudioFormat("mp3");
    setPromptEnhance("Auto");
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Music settings saved:", {
      selectedModel,
      sampleRate,
      bitrate,
      audioFormat,
      privateMode,
      promptEnhance,
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
                onClick={() => setIsModelsOpen(!isModelsOpen)}
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
                    <p className="text-gray-300 text-sm mt-1">
                      Selected: <span className="text-[#5AD7FF]">{selectedModel}</span>
                    </p>
                  </div>
                  <ChevronDown
                    className={`text-white text-xl md:text-3xl transition-transform duration-300 ${
                      isModelsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Simple Models Dropdown */}
              {isModelsOpen && (
                <div className="space-y-2 px-2 md:px-6 mb-4">
                  {[
                    { title: "music-1.5", image: "/imagegenerationnew/models/model1.png", description: "Generate AI music with text prompt and lyrics" }
                  ].map((model) => (
                    <div
                      key={model.title}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                        selectedModel === model.title
                          ? "bg-white/20 border border-[#6C3BFF] ring-2 ring-[#6C3BFF]/50"
                          : "bg-white/10 hover:bg-white/15"
                      }`}
                      onClick={() => {
                        setSelectedModel(model.title);
                        setIsModelsOpen(false);
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={model.image}
                          alt={model.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-base font-medium">{model.title}</h4>
                      </div>
                      {selectedModel === model.title && (
                        <div className="w-4 h-4 rounded-full bg-[#6C3BFF] flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Settings Section */}
            <div className="mb-6">
              <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>

              {/* Sample Rate */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Sample Rate</h3>
                <div className="grid grid-cols-2 gap-2 md:gap-4 px-2 md:px-6">
                  {[16000, 24000, 32000, 44100].map((rate) => (
                    <div
                      key={rate}
                      className={`w-full h-[60px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${sampleRate === rate
                          ? "border-[#6C3BFF] text-[#6C3BFF] bg-white/10"
                          : "border-gray-700 text-white hover:border-[#6C3BFF] bg-white/10"
                        }`}
                      onClick={() => setSampleRate(rate)}
                    >
                      <span className="text-sm">{rate}Hz</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bitrate */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Bitrate</h3>
                <div className="grid grid-cols-2 gap-2 md:gap-4 px-2 md:px-6">
                  {[32000, 64000, 128000, 256000].map((rate) => (
                    <div
                      key={rate}
                      className={`w-full h-[60px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${bitrate === rate
                          ? "border-[#6C3BFF] text-[#6C3BFF] bg-white/10"
                          : "border-gray-700 text-white hover:border-[#6C3BFF] bg-white/10"
                        }`}
                      onClick={() => setBitrate(rate)}
                    >
                      <span className="text-sm">{rate/1000}k</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Format */}
              <div className="mb-4">
                <h3 className="text-white text-lg font-medium mb-4 px-2 md:px-6">Audio Format</h3>
                <div className="grid grid-cols-3 gap-2 md:gap-4 px-2 md:px-6">
                  {["mp3", "wav", "pcm"].map((format) => (
                    <div
                      key={format}
                      className={`w-full h-[60px] border rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all
                        ${audioFormat === format
                          ? "border-[#6C3BFF] text-[#6C3BFF] bg-white/10"
                          : "border-gray-700 text-white hover:border-[#6C3BFF] bg-white/10"
                        }`}
                      onClick={() => setAudioFormat(format)}
                    >
                      <span className="text-sm uppercase">{format}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Private Mode Section */}
            <div className="mb-6">
              <PrivateMode
                privateMode={privateMode}
                setPrivateMode={setPrivateMode}
              />
            </div>
            {/* Add To Collection Section */}
            <div className="mb-6">
              <AddToCollection
                collections={collections}
                setCollections={setCollections}
                isCollectionOpen={isCollectionOpen}
                setIsCollectionOpen={setIsCollectionOpen}
              />
            </div>

            {/* Advance Settings Section */}
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
                options={["Auto", "Standard", "Creative"]}
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

              {/* Summary Section */}
              <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-6">
                <div className="text-white font-medium mb-3">Music Generation Settings</div>
                <div>Model: <span className="text-[#5AD7FF]">{selectedModel}</span></div>
                <div>Sample Rate: <span className="text-[#5AD7FF]">{sampleRate}Hz</span></div>
                <div>Bitrate: <span className="text-[#5AD7FF]">{bitrate/1000}k</span></div>
                <div>Format: <span className="text-[#5AD7FF]">{audioFormat.toUpperCase()}</span></div>
                <div>Private Mode: <span className="text-[#5AD7FF]">{privateMode ? "Enabled" : "Disabled"}</span></div>
                <div>Prompt Enhance: <span className="text-[#5AD7FF]">{promptEnhance}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
