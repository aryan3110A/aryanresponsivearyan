"use client"

import { useState } from "react"
import MusicOptionCard from "./MusicOptionCard"
import AdvanceSettingPanel from "./AdvanceSettingPanel"
import Image from "next/image"

interface SettingsPanelProps {
  isOpen: boolean
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
}

export default function SettingsPanel(props: SettingsPanelProps) {

  const HandleEvent1 = () => {
    console.log("handle Event 1")
  }
  const HandleEvent2 = () => {
    console.log("handle Event 2")
  }

  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {props.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] md:w-[560px] bg-transparent backdrop-blur-lg shadow-3xl transform transition-transform duration-300 ease-in-out z-50 ${
          props.isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-end p-4">
            <button
              onClick={props.onClose}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <span className="text-white text-2xl">×</span>
            </button>
          </div>

          {/* Content Slot (You add your own UI here) */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <div>

              <div className="flex flex-col gap-4">
                <a className="font-bold">Type of Music</a>
              <MusicOptionCard label="Classic"
        icon="/BRANDINGKIT/AddtoMisicInImage/music.svg"
        selected onClick={HandleEvent1} />
                <MusicOptionCard label="Hiphop"
        icon="/BRANDINGKIT/AddtoMisicInImage/hiphop.svg"
        selected onClick={HandleEvent2} />
              </div>
             
             <div className="mt-10">
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
           

          <div>
          <div className="mb-6 px-2 md:px-6">
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] text-white font-semibold text-lg transition-all"
                onClick={() => {}}>
                Save
                <span className="flex items-center ml-2 text-base font-medium">
                  (
                  <Image src="/BRANDINGKIT/PRODUCTGENERATION/coins.svg" alt="Tokens" width={24} height={24} className="mx-1" />
                  100
                  )
                </span>
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}