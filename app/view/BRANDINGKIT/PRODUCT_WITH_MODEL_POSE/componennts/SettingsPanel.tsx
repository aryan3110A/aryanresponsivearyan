"use client"

import { useState } from "react"
import { AspectRatio, NumberSelector } from "../../UI"
import SelectBackground from "./SelectBackground"
import Image from "next/image"
import CameraAngle from "./camera_angle"
import FontSelect from "./FontSelect"
import AddToCollection from "./addToCollection"
import PrivateMode from "./privateMode"
import AdvanceSettingPanel from "./advanceSettings"
import ResetToDefaults from "./resetToDefaults"
import PromptEnhancerPanel from "./promptEnhancer"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedFont: string
  setSelectedFont: (font: string) => void
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
  // State for all new sections
  const [selectedBackground, setSelectedBackground] = useState("/Blog/blog1.png")
  const [uploadedBackground, setUploadedBackground] = useState<string | null>(null)
  const [privateMode, setPrivateMode] = useState(false)
  const [isCollectionOpen, setIsCollectionOpen] = useState(true)
  const [collections, setCollections] = useState<string[]>([])
  const [photoReal, setPhotoReal] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState(false)
  const [transparency, setTransparency] = useState(false)
  const [tiling, setTiling] = useState(false)
  const [fixedSeed, setFixedSeed] = useState(false)
  const [promptEnhance, setPromptEnhance] = useState("Auto")
  const [showSummary, setShowSummary] = useState(false)
  // ... (other states for toggles, collections, etc. to be added)

  const backgrounds = [
    { src: "/Blog/blog1.png", label: "Background 1" },
    { src: "/Blog/blog2.png", label: "Background 2" },
    { src: "/Blog/blog3.png", label: "Background 3" },
    { src: "/Blog/blog4.png", label: "Background 4" },
  ]
  const handleBackgroundUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedBackground(url)
    setSelectedBackground(url)
  }



  // Add this function inside the SettingsPanel component
  const handleReset = () => {
    setSelectedBackground("/Blog/blog1.png");
    setUploadedBackground(null);
    props.setSelectedFont("Inter");
    setPrivateMode(false);
    setIsCollectionOpen(true);
    setCollections([]);
    setPhotoReal(false);
    setNegativePrompt(false);
    setTransparency(false);
    setTiling(false);
    setFixedSeed(false);
    setPromptEnhance("Auto");
    setShowSummary(false);
    // Optionally reset style, aspect ratio, quality, number of images if you want:
    // props.setSelectedStyle(null);
    // props.setSelectedAspectRatio("");
    // props.setSelectedQuality("");
    // props.setNumberOfImages(1);
  };

  return (
    <>
      {/* Backdrop */}
      {props.isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={props.onClose} />}
      {/* Settings Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] md:w-[560px] bg-transparent backdrop-blur-lg shadow-3xl transform transition-transform duration-300 ease-in-out z-50 ${props.isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button onClick={props.onClose} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <span className="text-white text-2xl">×</span>
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

            {/* Number of Images Section */}
            <NumberSelector
              onNumberSelect={props.setNumberOfImages}
              selectedNumber={props.numberOfImages}
              title="Number of Images"
            />
            {/* Font Select Section */}
            {/* Font Select Section */}
            <div className="mb-6">
              <FontSelect onFontSelect={props.setSelectedFont} selectedFont={props.selectedFont} />
            </div>
            {/* Camera Angle Section */}
            <CameraAngle onCameraAngleSelect={props.setSelectedStyle} selectedCameraAngle={props.selectedStyle} />
            {/* Frame Size Section */}
            <AspectRatio onAspectRatioSelect={props.setSelectedAspectRatio} selectedAspectRatio={props.selectedAspectRatio} />
            {/* Select Background Section */}
            <SelectBackground
              selectedBackground={selectedBackground}
              setSelectedBackground={setSelectedBackground}
              onUpload={handleBackgroundUpload}
              backgrounds={uploadedBackground ? [{ src: uploadedBackground, label: "Custom Upload" }, ...backgrounds] : backgrounds}
            />
            {/* Private Mode Section */}
            <div className="mb-6">
              <AddToCollection
                collections={collections}
                setCollections={setCollections}
                isCollectionOpen={isCollectionOpen}
                setIsCollectionOpen={setIsCollectionOpen}
              />
            </div>
            <div className="mb-6">
              <PrivateMode
                privateMode={privateMode}
                setPrivateMode={setPrivateMode}
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
              <PromptEnhancerPanel
                promptEnhance={promptEnhance}
                setPromptEnhance={setPromptEnhance}
              />
            </div>
            {/* Save Button */}
            <div className="mb-6 px-2 md:px-6">
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#3A1F8A] text-white font-semibold text-lg transition-all"
                onClick={() => setShowSummary(true)}>
                Save
                <span className="flex items-center ml-2 text-base font-medium">
                  (
                  <Image src="/BRANDINGKIT/PRODUCT_WITH_MODEL_POSE/coins.svg" alt="Tokens" width={24} height={24} className="mx-1" />
                  100
                  )
                </span>
              </button>
            </div>
            {/* Summary Section */}
            <div className="bg-white/10 backdrop-blur-3xl rounded-lg p-4 space-y-2 text-sm text-gray-300 mt-2 mb-6 mx-2 md:mx-6">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Number of Images:</span>
                <span className="text-white">{showSummary ? props.numberOfImages : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-white">Font Select:</span>
                <span className="text-white">{showSummary ? props.selectedFont : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-white">Camera Angle:</span>
                <span className="text-white">{showSummary ? props.selectedStyle : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-white">Frame Size:</span>
                <span className="text-white">{showSummary ? props.selectedAspectRatio : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-white">Background Selection:</span>
                <span className="text-white">{showSummary ? selectedBackground : ''}</span>
              </div>
            </div>

          </div>
        </div>
      </div>


    </>
  )
}
