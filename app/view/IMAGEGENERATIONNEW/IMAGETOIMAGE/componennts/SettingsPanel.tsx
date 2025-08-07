"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import ModelsPresetPanel from "./ModelsPresetPanel"
import { reduceNoise as ReduceNoise, upScale as UpScale, promptEnhancer as PromptEnhancer,  AspectRatio, Quality, NumberSelector, OptionSelector, SelectColor, effects as Effects, lightning as Lightning, cameraAngles as CameraAngle, AdvanceSettingPanel, AddToCollection, PrivateMode, VisualIntensity, SocialMedia
, ResetToDefaults,
SaveFile,
FontSelect} from "../../UI"

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
  onSave?: (settingsData: any) => void
  className?: string
}

export default function SettingsPanel({
  onClose,
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
  onSave,
}: SettingsPanelProps) {
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  // Color, Effect, and Lightning state
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState<string>("")
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)
  const [customEffect, setCustomEffect] = useState<string>("")
  const [selectedLightning, setSelectedLightning] = useState<string | null>(null)
  const [customLightning, setCustomLightning] = useState<string>("")
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<string | null>(null)
  const [photoReal, setPhotoReal] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [tiling, setTiling] = useState(false);
  const [fixedSeed, setFixedSeed] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [visualIntensity, setVisualIntensity] = useState<number>(1.0);
  const [visualIntensityEnabled, setVisualIntensityEnabled] = useState<boolean>(false);
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<string | null>(null);
  const [selectedSocialFormat, setSelectedSocialFormat] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [reduceNoise, setReduceNoise] = useState(false);
  const [upScale, setUpScale] = useState(false);
  const [saveFileType, setSaveFileType] = useState<string>("PNG");
  const [selectedFont, setSelectedFont] = useState<string>("");

  const [promptEnhance, setPromptEnhance] = useState("Auto");

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
    setSelectedAspectRatio("");
    setSelectedQuality("");
    setNumberOfImages(1);
  };

  const toggleModels = () => {
    setIsModelsOpen((prev) => !prev)
  }

  const handleModelSelect = (model: string) => {
    setSelectedModel(model)
    updateAspectRatioIfNeeded(model)
    setIsModelsOpen(false) // Close the models panel after selection
  }

  const handleSave = () => {
    // Create settings data object
    const settingsData = {
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
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave(settingsData)
    }
    
    console.log("Settings saved:", settingsData)
    onClose()
  }

  return (
    <>
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
            <h2 className="text-white text-sm font-normal">Settings</h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-24">

            {/* Model & Preset Section */}
            <div className="relative">
              <button
                ref={toggleButtonRef}
                onClick={toggleModels}
                className="px-6 md:px-10 w-full py-6 md:py-8 bg-white/10 rounded-lg border border-white/5 cursor-pointer hover:from-gray-700 hover:to-gray-600 transition-all mb-4 text-left relative overflow-hidden"
                style={{
                  backgroundImage: "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-sm font-normal">
                      Model & <span className="text-[#6C3BFF]">Preset</span>
                    </h3>
                  </div>
                  <ChevronDown
                    className={`text-white text-xl md:text-3xl transition-transform duration-300 ${
                      isModelsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Models Dropdown for Mobile/Tablet */}
              <div className="md:hidden">
                <ModelsPresetPanel
                  isOpen={isModelsOpen}
                  onClose={() => setIsModelsOpen(false)}
                  selectedModel={selectedModel}
                  onModelSelect={handleModelSelect}
                  excludeRef={toggleButtonRef}
                />
              </div>

              {/* Models Dropdown for Desktop */}
              <div className="hidden md:block">
                <ModelsPresetPanel
                  isOpen={isModelsOpen}
                  onClose={() => setIsModelsOpen(false)}
                  selectedModel={selectedModel}
                  onModelSelect={handleModelSelect}
                  excludeRef={toggleButtonRef}
                />
              </div>
            </div>

            {/* Visual Intensity Section */}
            <VisualIntensity
              visualIntensity={visualIntensity}
              setVisualIntensity={setVisualIntensity}
              isEnabled={visualIntensityEnabled}
              setIsEnabled={setVisualIntensityEnabled}
            />

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

            {/* Social Media Frame Section */}
            <SocialMedia
              selectedPlatform={selectedSocialPlatform}
              selectedFormat={selectedSocialFormat}
              onPlatformSelect={setSelectedSocialPlatform}
              onFormatSelect={setSelectedSocialFormat}
            />

            <div className="mb-6">
              <ReduceNoise reduceNoise={reduceNoise} setReduceNoise={setReduceNoise} />
            </div>
            <div className="mb-6">
              <UpScale upScale={upScale} setUpScale={setUpScale} />
            </div>

            {/* Style Palettes Section */}
            <div className="mb-6">
              <OptionSelector
                onOptionSelect={setSelectedStyle}
                selectedOption={selectedStyle}
                title="Art Style Conversions"
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
                  "Ghibli"
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
            <div className="mb-6">
              <FontSelect onFontSelect={setSelectedFont} selectedFont={selectedFont} />
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
              <div className="text-white font-normal mb-3 text-sm">Settings Summary</div>
              <div>Model Selection : <span className="text-[#5AD7FF]">{selectedModel}</span></div>
              <div>Visual Intensity : <span className="text-[#5AD7FF]">{visualIntensityEnabled ? visualIntensity.toFixed(1) : "Disabled"}</span></div>
              <div>Social Platform : <span className="text-[#5AD7FF]">{selectedSocialPlatform || "None"}</span></div>
              <div>Social Format : <span className="text-[#5AD7FF]">{selectedSocialFormat || "None"}</span></div>
              <div>Content Type : <span className="text-[#5AD7FF]">{selectedContentType || "None"}</span></div>
              <div>Art Style Conversions : <span className="text-[#5AD7FF]">{selectedStyle || "Bokeh"}</span></div>
              <div>Selected Color : <span className="text-[#5AD7FF]">{selectedColor || customColor || "None"}</span></div>
              <div>Selected Effect : <span className="text-[#5AD7FF]">{selectedEffect || customEffect || "None"}</span></div>
              <div>Selected Lightning : <span className="text-[#5AD7FF]">{selectedLightning || customLightning || "None"}</span></div>
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

    </>
  )
}
