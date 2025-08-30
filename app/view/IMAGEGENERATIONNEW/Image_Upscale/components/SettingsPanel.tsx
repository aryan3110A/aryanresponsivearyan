"use client"

import React from "react"
import { NumberSelector, SaveFile, Quality, ResetToDefaults } from "../../UI"

interface SettingsPanelProps {
  onClose: () => void
  upscaleFactor: number
  setUpscaleFactor: (factor: number) => void
  numberOfImages: number
  setNumberOfImages: (number: number) => void
  saveFileType: string | null
  setSaveFileType: (type: string | null) => void
  quality: string
  setQuality: (quality: string) => void
  className?: string
}

export default function SettingsPanel({
  onClose,
  upscaleFactor,
  setUpscaleFactor,
  numberOfImages,
  setNumberOfImages,
  saveFileType,
  setSaveFileType,
  quality,
  setQuality,
  className,
}: SettingsPanelProps) {

  const handleReset = () => {
    setUpscaleFactor(2)
    setNumberOfImages(1)
    setSaveFileType(null)
    setQuality("HD")
  }
  
  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", {
      upscaleFactor,
      numberOfImages,
      saveFileType,
      quality,
    })
    onClose()
  }

  return (
    <>
      {/* Settings Panel - Sticky and attached just below the navigation bar */}
      <div className={`sticky top-[64px] left-0 w-auto max-h-[calc(100vh-128px)] overflow-y-auto bg-transparent backdrop-blur-lg shadow-3xl border-r border-[#222] scrollbar-hide ${className || ''}`}>
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar { 
            display: none;
          }
        `}</style>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-white text-lg font-semibold">Upscale Settings</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-24">

            {/* Upscale Factor Section */}
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-3">
                <div className="text-white font-normal mb-2">Upscale Factor</div>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => setUpscaleFactor(factor)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        upscaleFactor === factor
                          ? 'bg-[#006aff] text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {factor}x
                    </button>
                  ))}
                </div>
                <div className="text-gray-400 text-xs">
                  Higher factors create larger images but may take longer
                </div>
              </div>
            </div>

            {/* Number of Images Section */}
            <div className="mb-6">
              <NumberSelector
                onNumberSelect={setNumberOfImages}
                selectedNumber={numberOfImages}
                title="Number of Variations"
                showBorderTop={true}
              />
            </div>

            {/* Quality Section */}
            <div className="mb-6">
              <Quality 
                onQualitySelect={setQuality} 
                selectedQuality={quality} 
              />
            </div>

            {/* Save File Type Section */}
            <div className="mb-6">
              <SaveFile
                onSaveFileTypeSelect={setSaveFileType}
                selectedOption={saveFileType}
                title="Save File Type"
                options={[
                  "PNG",
                  "JPEG",
                  "WebP",
                  "TIFF"
                ]}
                defaultOpen={false}
                showBorderTop={true} 
              />
            </div>

            {/* Reset to Defaults Button */}
            <div className="mb-6">
              <ResetToDefaults onReset={handleReset} />
            </div>

            {/* Settings Summary */}
            <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mb-6">
              <div className="text-white font-normal mb-3">Settings Summary</div>
              <div>Upscale Factor : <span className="text-[#5AD7FF]">{upscaleFactor}x</span></div>
              <div>Number of Variations : <span className="text-[#5AD7FF]">{numberOfImages}</span></div>
              <div>Quality : <span className="text-[#5AD7FF]">{quality}</span></div>
              <div>Save File Type : <span className="text-[#5AD7FF]">{saveFileType || "PNG"}</span></div>
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
