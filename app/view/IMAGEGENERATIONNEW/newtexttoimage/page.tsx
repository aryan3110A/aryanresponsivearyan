"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import Particles from "../../Core/Particals"

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
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]) // Store prompts for each image
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)


  const [selectedModel, setSelectedModel] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9")
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

  const modelSlugMap: Record<string, string> = {
    "Stable Turbo": "stable-turbo",
    "Stable Diffusion 3.5 Large": "stable-large",
    "Stable Diffusion 3.5 Medium": "stable-medium",
    "Stable XL": "stable-xl",
    "Flux.1 Dev": "flux-dev",
    "Flux.1 Schnell": "flux-schnell",
    "Flux.1 KONTEXT MAX": "flux-kontext-max",
    "Flux.1 KONTEXT PRO": "flux-kontext-pro"
  };

  // Map model names to their IDs for Flux models
  const modelIdMap: Record<string, number> = {
    "Flux.1 KONTEXT MAX": 6,
    "Flux.1 KONTEXT PRO": 7
  };

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
    const modelName = currentSettings?.model || selectedModel
    const modelId = modelIdMap[modelName]
    
    console.log("🚀 Starting image generation...")
    console.log("📝 Enhanced prompt:", finalPrompt)
    console.log("🎯 Selected model:", modelName)
    console.log("🆔 Model ID:", modelId)
    console.log("⚙️ Using settings:", currentSettings)

    // Check if it's a Flux model (ID 6 for Max, ID 7 for Pro)
    if (modelId === 6 || modelId === 7) {
      console.log(`🎯 Using Flux Kontext ${modelId === 6 ? 'Max' : 'Pro'} (ID: ${modelId})`)
      
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

      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            model: modelName,
            width,
            height,
            num_images: currentSettings?.numberOfImages || 1,
            modelId: modelId
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Flux API error:`, errorText)
          throw new Error(`Flux API error: ${response.status}`)
        }

        const data = await response.json()
        console.log(`✅ Flux ${modelId === 6 ? 'Max' : 'Pro'} generation successful:`, {
          hasImageUrls: !!data.image_urls,
          imageUrlsCount: data.image_urls?.length || 0,
          model: data.metadata?.model || data.model,
          imageUrls: data.image_urls,
          fullResponse: data
        })
        
        // Debug: Log the exact response structure
        console.log('🔍 DEBUG - Response structure:', {
          hasImageUrls: !!data.image_urls,
          hasImageUrl: !!data.imageUrl,
          hasSuccess: !!data.success,
          hasResult: !!data.result,
          hasMetadata: !!data.metadata,
          keys: Object.keys(data)
        })
        
        if (data.image_urls && data.image_urls.length > 0) {
          console.log(`🖼️ Setting generated image URLs: ${data.image_urls}`)
          setGeneratedImages(data.image_urls)
          setGeneratedPrompts(Array(data.image_urls.length).fill(prompt)) // Store the original input prompt
        } else if (data.imageUrl) {
          console.log(`🖼️ Setting generated image URL: ${data.imageUrl}`)
          setGeneratedImages([data.imageUrl])
          setGeneratedPrompts([prompt]) // Store the original input prompt
        } else if (data.success && data.result?.sample) {
          // Alternative response format
          console.log(`🖼️ Setting generated image URL from result.sample: ${data.result.sample}`)
          setGeneratedImages([data.result.sample])
          setGeneratedPrompts([prompt])
        } else if (data.originalImageUrl) {
          // Fallback to original URL
          console.log(`🖼️ Setting generated image URL from originalImageUrl: ${data.originalImageUrl}`)
          setGeneratedImages([data.originalImageUrl])
          setGeneratedPrompts([prompt])
        } else {
          console.error('❌ No image URL in response. Full response:', data)
          setGeneratedImages(["/placeholder.svg"])
          setGeneratedPrompts([""])
        }
      } catch (err) {
        console.error("❌ Flux API failed:", err)
        // Fallback to placeholder images
        setGeneratedImages(["/placeholder.svg"])
      } finally {
        setIsGenerating(false)
      }
      return
    }

    // Handle existing models (non-Flux)
    console.log(`🎯 Using existing model: ${modelName}`)
    
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
    const timeout = setTimeout(() => controller.abort(), 180000)

    try { 
      console.log(`📡 Calling local API for ${modelName} model`)
      
      // Use local API endpoint instead of ngrok to avoid CORS issues
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          model: modelName,
          width,
          height,
          num_images: currentSettings?.numberOfImages || 1,
        }),
        signal: controller.signal
      })
      clearTimeout(timeout)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      console.log(`✅ ${modelName} generation successful. Full response:`, data)
      if (data.imageUrl) {
        // Handle Flux API response format
        console.log("🚀 Flux API generation successful:", data);
        setGeneratedImages([data.imageUrl])
        setGeneratedPrompts([prompt])
      }
      else if (data.success && data.image_urls) {
        // Handle regular API response format
        console.log("🚀 Regular API generation successful:", data);
        setGeneratedImages(data.image_urls)
        // Create array of prompts for each image (using original input prompt)
        const promptsArray = Array(data.image_urls.length).fill(prompt)
        setGeneratedPrompts(promptsArray)
      }
      else {
        console.error('❌ Generation failed. Full response:', data)
        setGeneratedImages(["/placeholder.svg"])
        setGeneratedPrompts([""])
      }
    } catch (err) {
      console.error("❌ Primary API failed:", err)
      try {
        console.log(`🔄 Trying direct ngrok endpoint as fallback`)
        
        // Try direct ngrok as last resort
        const modelSlug = modelSlugMap[modelName] || "stable-turbo"
        const modelEndpoint = `https://3770353c90dd.ngrok-free.app/${modelSlug}/generate`
        
        const fallback = await fetch(modelEndpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ prompt: finalPrompt, width, height, num_images: numberOfImages })
        })
        if (!fallback.ok) throw new Error(`Fallback HTTP error: ${fallback.status}`)
        const data = await fallback.json()
        setGeneratedImages(data.image_urls || [])
      } catch (fallbackErr) {
        console.error("❌ Fallback also failed:", fallbackErr)
        // Set placeholder images as final fallback
        setGeneratedImages(["/placeholder.svg"])
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
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
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
              generatedPrompts={generatedPrompts}
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
