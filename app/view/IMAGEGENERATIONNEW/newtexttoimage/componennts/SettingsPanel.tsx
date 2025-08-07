"use client"

import { useState, useRef } from "react"
import { ChevronDown, Check } from "lucide-react"
import { ModelsPresetPanel, promptEnhancer as PromptEnhancer,  AspectRatio, Quality, NumberSelector, OptionSelector, SelectColor, effects as Effects, lightning as Lightning, cameraAngles as CameraAngle, AdvanceSettingPanel, AddToCollection, PrivateMode, VisualIntensity, SocialMedia
, ResetToDefaults} from "../../UI"

interface SettingsData {
  model: string;
  style: string | null;
  aspectRatio: string;
  quality: string;
  numberOfImages: number;
  color: string | null;
  customColor: string;
  effect: string | null;
  customEffect: string;
  lightning: string | null;
  customLightning: string;
  cameraAngle: string | null;
  visualIntensity: number;
  visualIntensityEnabled: boolean;
  socialPlatform: string | null;
  socialFormat: string | null;
  contentType: string | null;
  promptEnhance: string;
}

interface SettingsPanelProps {
  onClose: () => void
  onSave: (settingsData: SettingsData) => void
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
  selectedColor: string | null
  setSelectedColor: (color: string | null) => void
  customColor: string
  setCustomColor: (color: string) => void
  selectedEffect: string | null
  setSelectedEffect: (effect: string | null) => void
  customEffect: string
  setCustomEffect: (effect: string) => void
  selectedLightning: string | null
  setSelectedLightning: (lightning: string | null) => void
  customLightning: string
  setCustomLightning: (lightning: string) => void
  selectedCameraAngle: string | null
  setSelectedCameraAngle: (angle: string | null) => void
  visualIntensity: number
  setVisualIntensity: (intensity: number) => void
  visualIntensityEnabled: boolean
  setVisualIntensityEnabled: (enabled: boolean) => void
  selectedSocialPlatform: string | null
  setSelectedSocialPlatform: (platform: string | null) => void
  selectedSocialFormat: string | null
  setSelectedSocialFormat: (format: string | null) => void
  selectedContentType: string | null
  setSelectedContentType: (type: string | null) => void
  promptEnhance: string
  setPromptEnhance: (enhance: string) => void
}

export default function SettingsPanel({
  onClose,
  onSave,
  selectedModel,
  setSelectedModel,
  selectedStyle,
  setSelectedStyle,
  selectedAspectRatio,
  setSelectedAspectRatio,
  selectedQuality,
  setSelectedQuality,
  numberOfImages,
  setNumberOfImages,
  selectedColor,
  setSelectedColor,
  customColor,
  setCustomColor,
  selectedEffect,
  setSelectedEffect,
  customEffect,
  setCustomEffect,
  selectedLightning,
  setSelectedLightning,
  customLightning,
  setCustomLightning,
  selectedCameraAngle,
  setSelectedCameraAngle,
  visualIntensity,
  setVisualIntensity,
  visualIntensityEnabled,
  setVisualIntensityEnabled,
  selectedSocialPlatform,
  setSelectedSocialPlatform,
  selectedSocialFormat,
  setSelectedSocialFormat,
  selectedContentType, // This should come from props
  setSelectedContentType, // This should come from props
  promptEnhance, // This should come from props
  setPromptEnhance, // This should come from props
}: SettingsPanelProps) {
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  // Add popup state
  const [showSavePopup, setShowSavePopup] = useState(false)

  // Remove duplicate state declarations - use props instead
  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  // Remove these duplicate states - use props instead
  // const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  //   const [promptEnhance, setPromptEnhance] = useState("Auto");

  // Function to get aspect ratios based on selected model
  const getAspectRatiosForModel = (model: string) => {
    // Flux models only support aspect ratios between 21:9 and 9:21
    if (model === "Flux.1 KONTEXT MAX" || model === "Flux.1 KONTEXT PRO") {
      return [
        { label: "21:9", icon: "▬" },
        { label: "16:9", icon: "▭" },
        { label: "9:16", icon: "▬" },
        { label: "9:21", icon: "▬" }
      ]
    }
    
    // All other models support all aspect ratios
    return [
      { label: "1:1", icon: "⬜" },
      { label: "16:9", icon: "▭" },
      { label: "9:16", icon: "▬" },
      { label: "4:3", icon: "▭" }
    ]
  }

  // Get current aspect ratios based on selected model
  const currentAspectRatios = getAspectRatiosForModel(selectedModel)

  // Update selected aspect ratio if current one is not supported by the model
  const updateAspectRatioIfNeeded = (newModel: string) => {
    const supportedRatios = getAspectRatiosForModel(newModel)
    const isCurrentRatioSupported = supportedRatios.some(ratio => ratio.label === selectedAspectRatio)
    
    if (!isCurrentRatioSupported) {
      // Default to first supported ratio
      setSelectedAspectRatio(supportedRatios[0].label)
    }
  }

  const handleReset = () => {
    setIsModelsOpen(false);
    setSelectedColor(null);
    setCustomColor("");
    setSelectedEffect(null);
    setCustomEffect("");
    setSelectedLightning(null);
    setCustomLightning("");
    setSelectedCameraAngle(null);
    setPhotoReal(false);
    setNegativePrompt(false);
    setTransparency(false);
    setTiling(false);
    setFixedSeed(false);
    setCollections([]);
    setIsCollectionOpen(false);
    setPrivateMode(false);
    setVisualIntensity(1.0);
    setVisualIntensityEnabled(false);
    setSelectedSocialPlatform(null);
    setSelectedSocialFormat(null);
    setSelectedContentType(null);
    setSelectedStyle(null);
    setSelectedAspectRatio("1:1"); // Set default
    setSelectedQuality("HD"); // Set default
    setNumberOfImages(1);
    setPromptEnhance("Auto");
  };

  const toggleModels = () => {
    setIsModelsOpen((prev) => !prev)
  }

  const handleSave = () => {
    console.log("SettingsPanel handleSave - selectedModel:", selectedModel)
    
    // Validate that a model is selected before saving
    if (!selectedModel) {
      alert("Please select a model first!")
      return
    }
    
    // Show popup
    setShowSavePopup(true)
    
    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowSavePopup(false)
    }, 2000)
    
    // Apply settings to backend/prompt
    const settingsData: SettingsData = {
      model: selectedModel,
      style: selectedStyle,
      aspectRatio: selectedAspectRatio,
      quality: selectedQuality,
      numberOfImages: numberOfImages,
      color: selectedColor,
      customColor: customColor,
      effect: selectedEffect,
      customEffect: customEffect,
      lightning: selectedLightning,
      customLightning: customLightning,
      cameraAngle: selectedCameraAngle,
      visualIntensity: visualIntensity,
      visualIntensityEnabled: visualIntensityEnabled,
      socialPlatform: selectedSocialPlatform,
      socialFormat: selectedSocialFormat,
      contentType: selectedContentType,
      promptEnhance: promptEnhance
    }
    
    console.log("Settings data being passed:", settingsData)
    
    // Call parent's save handler with settings
    onSave(settingsData)
    
    // Close the settings panel
    onClose()
  }

  return (
    <>
      {/* Settings Panel - Sticky and attached just below the navigation bar */}
      <div className="sticky top-[64px] left-0 w-auto max-h-[calc(100vh-128px)] overflow-y-auto bg-transparent backdrop-blur-lg shadow-3xl  border-r border-[#222] scrollbar-hide">
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
            <h2 className="text-white text-lg font-semibold">Presets</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-24">

            {/* Model & Preset Section */}
            <div className="relative">
              <button
                ref={toggleButtonRef}
                onClick={toggleModels}
                className="px-4 md:px-6 w-full py-4 md:py-6 bg-white/10 rounded-lg border border-white/5 cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all mb-4 text-left relative overflow-hidden"
                style={{
                  backgroundImage: "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-normal">
                      Models
                    </h3>
                  </div>
                  <ChevronDown
                    className={`text-white text-sm md:text-sm transition-transform duration-300 ${
                      isModelsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Models Dropdown */}
              {isModelsOpen && (
                <div className="absolute top-full left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl">
                  <ModelsPresetPanel
                    isOpen={isModelsOpen}
                    onClose={() => setIsModelsOpen(false)}
                    selectedModel={selectedModel}
                    onModelSelect={(model: string) => {
                      setSelectedModel(model)
                      updateAspectRatioIfNeeded(model)
                      setIsModelsOpen(false)
                    }}
                  />
                </div>
              )}
            </div>

            {/* Visual Intensity Section */}
            <VisualIntensity
              visualIntensity={visualIntensity}
              setVisualIntensity={setVisualIntensity}
              isEnabled={visualIntensityEnabled}
              setIsEnabled={setVisualIntensityEnabled}
            />

            {/* Social Media Frame Section */}
            <SocialMedia
              selectedPlatform={selectedSocialPlatform}
              selectedFormat={selectedSocialFormat}
              onPlatformSelect={setSelectedSocialPlatform}
              onFormatSelect={setSelectedSocialFormat}
            />

            {/* Style Palettes Section */}
            <div className="mb-6">
              <OptionSelector
                onOptionSelect={setSelectedStyle}
                selectedOption={selectedStyle}
                title="Style Palettes"
                options={[
                  "Realistic",
                  "Anime",
                  "Cartoon",
                  "Digital Art",
                  "Oil Painting",
                  "Watercolor",
                  "Sketch",
                  "Pop Art",
                  "Abstract",
                  "Minimalist",
                  "Vintage",
                  "Cyberpunk",
                  "Fantasy",
                  "Sci-Fi",
                  "Gothic",
                  "Impressionist"
                ]}
                defaultOpen={false}
                showBorderTop={true}
              />
            </div>
          
            <div className="mb-6">
              <Effects
                onEffectSelect={setSelectedEffect}
                selectedEffect={selectedEffect}
                customEffect={customEffect}
                setCustomEffect={setCustomEffect}
              />
            </div>

            {/* select color */}
            <div className="mb-6">
              <SelectColor
                onColorSelect={setSelectedColor}
                selectedColor={selectedColor}
                customColor={customColor}
                setCustomColor={setCustomColor}
              />
            </div>

            <div className="mb-6">
              <Lightning
                onLightningSelect={setSelectedLightning}
                selectedLightning={selectedLightning}
                customLightning={customLightning}
                setCustomLightning={setCustomLightning}
              />
            </div>
            <div className="mb-6">
              <CameraAngle 
                onCameraAngleSelect={setSelectedCameraAngle}
                selectedCameraAngle={selectedCameraAngle}
              />
            </div>
         
            {/* Quality Section */}
            <div className="mb-6">
              <Quality onQualitySelect={setSelectedQuality} selectedQuality={selectedQuality} />
            </div>

            {/* Aspect Ratio Section */}
            <div className="mb-6">
              <AspectRatio 
                onAspectRatioSelect={setSelectedAspectRatio}
                selectedAspectRatio={selectedAspectRatio}
                title="Frame Size"
                ratios={currentAspectRatios}
              />
            </div>

            {/* Number of Images Section */}
            <div className="mb-6">
              <NumberSelector
                onNumberSelect={setNumberOfImages}
                selectedNumber={numberOfImages}
                title="Number of Images"
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
              <PromptEnhancer
                promptEnhance={promptEnhance}
                setPromptEnhance={setPromptEnhance}
              />
            </div>

            {/* Settings Summary */}
            <div className="bg-white/10 backdrop-blur-3xl hover:bg-white/20 rounded-lg p-4 space-y-2 text-sm text-gray-300 mb-6">
              <div className="text-white font-normal mb-3">Settings Summary</div>
              <div>Model Selection : <span className="text-[#5AD7FF]">{selectedModel}</span></div>
              <div>Visual Intensity : <span className="text-[#5AD7FF]">{visualIntensityEnabled ? visualIntensity.toFixed(1) : "Disabled"}</span></div>
              <div>Style Palettes : <span className="text-[#5AD7FF]">{selectedStyle || "None"}</span></div>
              <div>Effects : <span className="text-[#5AD7FF]">{selectedEffect || customEffect || "None"}</span></div>
              <div>Color Selection : <span className="text-[#5AD7FF]">{selectedColor || customColor || "None"}</span></div>
              <div>Lightning : <span className="text-[#5AD7FF]">{selectedLightning || customLightning || "None"}</span></div>
              <div>Camera Angle : <span className="text-[#5AD7FF]">{selectedCameraAngle || "None"}</span></div>
              <div>Image Quality : <span className="text-[#5AD7FF]">{selectedQuality}</span></div>
              <div>Frame Size : <span className="text-[#5AD7FF]">{selectedAspectRatio}</span></div>
              <div>Number of Image : <span className="text-[#5AD7FF]">{numberOfImages}</span></div>
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

      {/* Save Popup */}
      {showSavePopup && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-60">
          <Check className="w-4 h-4" />
          Changes Saved
        </div>
      )}
    </>
  )
}















