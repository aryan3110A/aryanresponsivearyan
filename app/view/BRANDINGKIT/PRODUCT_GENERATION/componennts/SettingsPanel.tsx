"use client"

import { NumberSelector } from "../../UI"

interface SettingsPanelProps {
  onClose: () => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  selectedStyle: string | null
  setSelectedStyle: (style: string | null) => void
  selectedAspectRatio: string
  setSelectedAspectRatio: (ratio: string) => void
  selectedQuality: string
  setSelectedQuality: (quality: string) => void
  numberOfImages: number
  setNumberOfImages: (number: number) => void
  className?: string
}

export default function SettingsPanel(props: SettingsPanelProps) {
  // No internal state needed

  return (
    <>
      <div className={`sticky top-[64px] left-0 w-[340px] max-h-[calc(100vh-128px)] overflow-y-auto bg-transparent backdrop-blur-lg shadow-3xl z-30 border-r border-[#222] ${props.className || ''}`}>
        <div className="h-auto flex flex-col">
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

            {/* Number of Products Section - matches Logo Generation */}
            <div className="mb-0">
              <NumberSelector
                onNumberSelect={props.setNumberOfImages}
                selectedNumber={props.numberOfImages}
                title="Number of Products"
              />
            </div>
          </div>
          {/* Save Button - matches Logo Generation */}
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
            <button
              onClick={() => {}}
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
