"use client"

import { useState } from "react"
import { NumberSelector } from "../../UI"
import LogoStyle from "./logoStyle"
import FontSelect from "./FontSelect"
import SelectColor from "./SelectColor"
import AdvanceSettingPanel from "./AdvanceSettingPanel"
import PromptEnhancerPanel from "./PromptEnhancerPanel"
import SaveFile from "./SaveFile"
import LogoPasteName from "./LogoPasteName"
import PrivateMode from "./PrivateMode"
import AddToCollection from "./AddToCollection"
import ResetToDefaults from "./ResetToDefaults"
import SelectBackground from "./SelectBackground"
import SummarySection from "./SummarySection"
import SaveButton from "./SaveButton"

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
  numberOfLogo: number
  setNumberOfLogo: (number: number) => void
}

export default function SettingsPanel(props: SettingsPanelProps) {
  // State for all new sections
  const [selectedBackground, setSelectedBackground] = useState("/Blog/blog1.png")
  const [uploadedBackground, setUploadedBackground] = useState<string | null>(null)
  const [selectedFont, setSelectedFont] = useState("Inter")
  const [selectedColor, setSelectedColor] = useState("Blue")
  const [customColor, setCustomColor] = useState("")
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
  // Add state for numberOfLogo if not present
  const [numberOfLogo, setNumberOfLogo] = useState(props.numberOfLogo || 1)
  // Add state for selectedFileType
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null)
  // Add state for logoName
  const [logoName, setLogoName] = useState("")
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
    setSelectedFont("Inter");
    setSelectedColor("Blue");
    setCustomColor("");
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
    // Optionally reset model, style, aspect ratio, quality, number of images if you want:
    // props.setSelectedModel("");
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
        className={`fixed top-0 left-0 h-full w-[90%] md:w-[560px] bg-transparent backdrop-blur-lg shadow-3xl transform transition-transform duration-300 ease-in-out z-50 ${
          props.isOpen ? "translate-x-0" : "-translate-x-full"
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
            {/* Number of Logo Section */}
            <div className="mb-6">
              <NumberSelector
                onNumberSelect={setNumberOfLogo}
                selectedNumber={numberOfLogo}
                title="Number of Logos"
              />
            </div>
            {/* Save File Type Section */}
            <div className="mb-6">
              <SaveFile onFileTypeSelect={setSelectedFileType} selectedFileType={selectedFileType} />
            </div>
            {/* Font Select Section */}
            <div className="mb-6">
              <FontSelect onFontSelect={setSelectedFont} selectedFont={selectedFont} />
            </div>
            {/* Select Color Section */}
            <div className="mb-6">
              <SelectColor onColorSelect={setSelectedColor} selectedColor={selectedColor} customColor={customColor} setCustomColor={setCustomColor} />
            </div>
            {/* Logo Style Section */}
            <div className="mb-6">
              <LogoStyle onStyleSelect={props.setSelectedStyle} selectedStyle={props.selectedStyle} />
            </div>
            {/* Select Background Section */}
            <div className="mb-6">
              <SelectBackground
                backgrounds={uploadedBackground ? [{ src: uploadedBackground, label: "Custom Upload" }, ...backgrounds] : backgrounds}
                selectedBackground={selectedBackground}
                setSelectedBackground={setSelectedBackground}
                onUpload={handleBackgroundUpload}
              />
            </div>
            {/* Logo Name Section */}
            <div className="mb-6">
              <LogoPasteName logoName={logoName} setLogoName={setLogoName} />
            </div>
            {/* Private Mode Section */}
            <div className="mb-6">
              <PrivateMode privateMode={privateMode} setPrivateMode={setPrivateMode} />
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
            {/* Advance Setting Section */}
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
            {/* Prompt Enhance Dropdown */}
            <div className="mb-4  ">
              <PromptEnhancerPanel
                promptEnhance={promptEnhance}
                setPromptEnhance={setPromptEnhance}
              />
            </div>

            {/* Reset to Defaults Button */}
            <ResetToDefaults onReset={handleReset} />

            {/* Summary Section */}
            <SummarySection
              showSummary={showSummary}
              selectedModel={props.selectedModel}
              selectedBackground={selectedBackground}
              selectedAspectRatio={props.selectedAspectRatio}
              selectedFont={selectedFont}
            />
            {/* Save Button */}
            <SaveButton onClick={() => setShowSummary(true)} showSummary={showSummary} />

            {/* Model & Preset Button */}
            <div className="mb-6 px-2 md:px-6">
              {/* This section is removed as per the edit hint */}
            </div>
            {/* Font Select, Color Select, and other sections will be added next */}
          </div>
        </div>
      </div>

      {/* Desktop Models Panel */}
      <div className="hidden md:block">
        {/* This section is removed as per the edit hint */}
      </div>
    </>
  )
}
