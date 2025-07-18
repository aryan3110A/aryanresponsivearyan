"use client"

import {  X } from "lucide-react"
import { NumberSelector, OptionSelector, promptEnhancer as PromptEnhancer, SaveFile, Expression, stickerConsistency as StickerConsistency, AddToCollection, AdvanceSettingPanel, ResetToDefaults } from "../../UI"
import { useState } from "react"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  stickerType: string | null
  setStickerType: (type: string | null) => void
  numberOfStickers: number
  setNumberOfStickers: (number: number) => void
  saveFileType: string | null
  setSaveFileType: (type: string | null) => void
  expression: string | null
  setExpression: (expression: string | null) => void
  promptEnhance: string
  setPromptEnhance: (value: string) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  stickerType,
  setStickerType,
  numberOfStickers,
  setNumberOfStickers,
  saveFileType,
  setSaveFileType,
  expression,
  setExpression,
  promptEnhance,
  setPromptEnhance,
}: SettingsPanelProps) {
  const [stickerConsistency, setStickerConsistency] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);

  const handleReset = () => {
    setStickerConsistency(false);
    setCollections([]);
    setIsCollectionOpen(false);
    setPhotoReal(false);
    setNegativePrompt(false);
    setTransparency(false);
    setTiling(false);
    setFixedSeed(false);
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
            {/* Number of Stickers Section */}
            
            
            <div className="mb-6">
              <NumberSelector
                onNumberSelect={setNumberOfStickers}
                selectedNumber={numberOfStickers}
                title="Number of Stickers"
              />
            </div>
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
                defaultOpen={true}
                showBorderTop={true} />
            </div>

            <div className="mb-6">
              <Expression
                onExpressionSelect={setExpression}
                selectedExpression={expression}
              />
            </div>

            <div className="mb-6">
              <StickerConsistency
                stickerConsistency={stickerConsistency}
                setStickerConsistency={setStickerConsistency}
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
                defaultOpen={true}
                showBorderTop={true}
              />
            </div>
           
            
            <div className="mb-6">
              <AddToCollection
                collections={collections}
                setCollections={setCollections}
                isCollectionOpen={isCollectionOpen}
                setIsCollectionOpen={setIsCollectionOpen}
              />
            </div>
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
            <div className="mb-6">
              <ResetToDefaults onReset={handleReset} />
            </div>

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
              <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-6">
                <div className="text-white font-medium mb-3">Settings Summary</div>
                <div>Sticker Type : <span className="text-[#5AD7FF]">{stickerType || "None"}</span></div>
                <div>Number of Stickers : <span className="text-[#5AD7FF]">{numberOfStickers}</span></div>
                <div>Save File Type : <span className="text-[#5AD7FF]">{saveFileType || "None"}</span></div>
                <div>Expression : <span className="text-[#5AD7FF]">{expression || "None"}</span></div>
                <div>Sticker Consistency : <span className="text-[#5AD7FF]">{stickerConsistency ? "Enabled" : "Disabled"}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
