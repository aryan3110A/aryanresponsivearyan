"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

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

export default function NewText2Image() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [selectedModel, setSelectedModel] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState("")
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)
  const [customEffect, setCustomEffect] = useState("")
  const [selectedLightning, setSelectedLightning] = useState<string | null>(null)
  const [customLightning, setCustomLightning] = useState("")
  const [selectedCameraAngle, setSelectedCameraAngle] = useState<string | null>(null)
  const [visualIntensity, setVisualIntensity] = useState(1.0)
  const [visualIntensityEnabled, setVisualIntensityEnabled] = useState(false)
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<string | null>(null)
  const [selectedSocialFormat, setSelectedSocialFormat] = useState<string | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null)
  const [promptEnhance, setPromptEnhance] = useState("Auto")

  const [currentSettings, setCurrentSettings] = useState<SettingsData | null>(null)

  const buildEnhancedPrompt = (basePrompt: string, settings: SettingsData) => {
    let enhancedPrompt = basePrompt
    if (settings?.style) enhancedPrompt += `, ${settings.style} style`
    if (settings?.color) enhancedPrompt += `, ${settings.color} color scheme`
    else if (settings?.customColor) enhancedPrompt += `, ${settings.customColor} color`
    if (settings?.effect) enhancedPrompt += `, ${settings.effect} effect`
    else if (settings?.customEffect) enhancedPrompt += `, ${settings.customEffect}`
    if (settings?.lightning) enhancedPrompt += `, ${settings.lightning} lighting`
    else if (settings?.customLightning) enhancedPrompt += `, ${settings.customLightning} lighting`
    if (settings?.cameraAngle) enhancedPrompt += `, ${settings.cameraAngle} view`
    if (settings?.visualIntensityEnabled) {
      const level = settings.visualIntensity > 1.5 ? "high detail" : settings.visualIntensity > 1.0 ? "detailed" : "soft detail"
      enhancedPrompt += `, ${level}`
    }
    if (settings?.quality === "4K") enhancedPrompt += ", ultra high resolution, 4K quality"
    else if (settings?.quality === "HD") enhancedPrompt += ", high resolution, HD quality"

    console.log("Enhanced prompt:", enhancedPrompt)
    return enhancedPrompt
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)

    const finalPrompt = currentSettings ? buildEnhancedPrompt(prompt, currentSettings) : prompt
    console.log("Generating with enhanced prompt:", finalPrompt)
    console.log("Using settings:", currentSettings)

    const aspectRatio = currentSettings?.aspectRatio || "1:1"
    const quality = currentSettings?.quality || "HD"
    let width = 768, height = 768
    if (aspectRatio === "16:9") {
      width = quality === "4K" ? 1920 : 1024
      height = quality === "4K" ? 1080 : 576
    } else if (aspectRatio === "9:16") {
      width = quality === "4K" ? 1080 : 576
      height = quality === "4K" ? 1920 : 1024
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 9500)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          model: currentSettings?.model || selectedModel,
          width,
          height,
          num_images: currentSettings?.numberOfImages || 1,
        }),
        signal: controller.signal
      })
      clearTimeout(timeout)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      if (data.success && data.image_urls) setGeneratedImages(data.image_urls)
      else console.error('Generation failed:', data.error)
    } catch (err) {
      console.error("Primary API failed:", err)
      try {
        const fallback = await fetch('https://cf5fbb801d9c.ngrok-free.app/stable-turbo/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: finalPrompt, width, height, num_images: numberOfImages })
        })
        if (!fallback.ok) throw new Error(`Fallback HTTP error: ${fallback.status}`)
        const data = await fallback.json()
        setGeneratedImages(data.image_urls || [])
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSettingsSave = (settingsData: SettingsData) => setCurrentSettings(settingsData)
  const handleSettingsToggle = () => setIsSettingsOpen(!isSettingsOpen)

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image src="/newt2image/bg.png" alt="background" width={1920} height={1080} className="w-auto h-auto md:-mt-48 object-contain" />
        </div>
        <NavigationFull />
        <div className="relative z-10">
          <Header title="Text to Image Generator" />
          <main className="container mx-auto lg:px-8 xl:px-12 2xl:px-16">
            <InputSection
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              onSettingsToggle={handleSettingsToggle}
              isGenerating={isGenerating}
              generatedImages={generatedImages}
              selectedModel={selectedModel}
              selectedStyle={selectedStyle}
              selectedQuality={selectedQuality}
              selectedAspectRatio={selectedAspectRatio}
              numberOfImages={numberOfImages}
            />
          </main>
        </div>

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedAspectRatio={selectedAspectRatio}
          setSelectedAspectRatio={setSelectedAspectRatio}
          selectedQuality={selectedQuality}
          setSelectedQuality={setSelectedQuality}
          numberOfImages={numberOfImages}
          setNumberOfImages={setNumberOfImages}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          customColor={customColor}
          setCustomColor={setCustomColor}
          selectedEffect={selectedEffect}
          setSelectedEffect={setSelectedEffect}
          customEffect={customEffect}
          setCustomEffect={setCustomEffect}
          selectedLightning={selectedLightning}
          setSelectedLightning={setSelectedLightning}
          customLightning={customLightning}
          setCustomLightning={setCustomLightning}
          selectedCameraAngle={selectedCameraAngle}
          setSelectedCameraAngle={setSelectedCameraAngle}
          visualIntensity={visualIntensity}
          setVisualIntensity={setVisualIntensity}
          visualIntensityEnabled={visualIntensityEnabled}
          setVisualIntensityEnabled={setVisualIntensityEnabled}
          selectedSocialPlatform={selectedSocialPlatform}
          setSelectedSocialPlatform={setSelectedSocialPlatform}
          selectedSocialFormat={selectedSocialFormat}
          setSelectedSocialFormat={setSelectedSocialFormat}
          selectedContentType={selectedContentType}
          setSelectedContentType={setSelectedContentType}
          promptEnhance={promptEnhance}
          setPromptEnhance={setPromptEnhance}
        />
      </div>
      <Footer />
    </>
  )
}
