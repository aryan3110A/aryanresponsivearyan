"use client"

import React from "react"
import { NumberSelector, OptionSelector, SaveFile, Expression, ResetToDefaults } from "../../UI"

interface SettingsPanelProps {
  onClose: () => void
  stickerType: string | null
  setStickerType: (type: string | null) => void
  numberOfStickers: number
  setNumberOfStickers: (number: number) => void
  saveFileType: string | null
  setSaveFileType: (type: string | null) => void
  expression: string | null
  setExpression: (expression: string | null) => void
  className?: string
}

export default function SettingsPanel({
  onClose,
  stickerType,
  setStickerType,
  numberOfStickers,
  setNumberOfStickers,
  saveFileType,
  setSaveFileType,
  expression,
  setExpression,
  className,
}: SettingsPanelProps) {


  const handleReset = () => {
    setStickerType(null);
    setNumberOfStickers(1);
    setSaveFileType(null);
    setExpression(null);
  };
  
  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", {
      stickerType,
      numberOfStickers,
      saveFileType,
      expression,
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
            <h2 className="text-white text-lg font-semibold">Settings</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-24">

            {/* Number of Stickers Section - Moved to top */}
            <div className="mb-6">
              <NumberSelector
                onNumberSelect={setNumberOfStickers}
                selectedNumber={numberOfStickers}
                title="Number of Stickers"
                showBorderTop={true}
              />
            </div>

            {/* Sticker Type Section */}
            <div className="mb-6">
              <OptionSelector
                onOptionSelect={setStickerType}
                selectedOption={stickerType}
                title="Sticker Type"
                options={[
                  "Illustration",
                  "Clipart",
                  "Photo",
                  "Ink Sketch",
                  "Doodle",
                  "Realistic",
                  "Low Poly",
                  "Pop Art",
                  "3d",
                  "Comics",
                  "Drawing",
                  "Oil Painting",
                  "Cartoon",
                  "Cyberpunk",
                  "Psychedelic",
                  "Digital"
                ]}
                defaultOpen={false}
                showBorderTop={true}
              />
            </div>

            {/* Expression Section */}
            <div className="mb-6">
              <Expression
                onExpressionSelect={setExpression}
                selectedExpression={expression}
              />
            </div>

            {/* Save File Type Section */}
            <div className="mb-6">
              <SaveFile
                onSaveFileTypeSelect={setSaveFileType}
                selectedOption={saveFileType}
                title="Save File Type"
                options={[
                  "GIF",
                  "Sticker",
                  "PNG",
                  "SVG"
                ]}
                defaultOpen={false}
                showBorderTop={true} />
            </div>

            {/* Reset to Defaults Button */}
            <div className="mb-6">
              <ResetToDefaults onReset={handleReset} />
            </div>



            {/* Settings Summary */}
            <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mb-6">
              <div className="text-white font-normal mb-3">Settings Summary</div>
              <div>Number of Stickers : <span className="text-[#5AD7FF]">{numberOfStickers}</span></div>
              <div>Sticker Type : <span className="text-[#5AD7FF]">{stickerType || "None"}</span></div>
              <div>Expression : <span className="text-[#5AD7FF]">{expression || "None"}</span></div>
              <div>Save File Type : <span className="text-[#5AD7FF]">{saveFileType || "None"}</span></div>
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
