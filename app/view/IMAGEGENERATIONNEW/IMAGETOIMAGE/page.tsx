"use client"

import React, { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"

// Model ID mapping for Flux APIs
const modelIdMap: Record<string, number> = {
  "Stable XL": 1,
  "Flux.1 Dev": 2,
  "Stable Diffusion 3.5 Large": 3,
  "Stable Diffusion 3.5 Medium": 4,
  "Stable Turbo": 5,
  "Flux.1 KONTEXT MAX": 6,
  "Flux.1 KONTEXT PRO": 7,
}

// Settings interface to match the text-to-image page
//hello
//hello
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

export default function ImageToImage() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Flux.1 KONTEXT MAX")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  

  
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
    setGeneratedImages([]) // Clear previous images
    
    try {
      // Use enhanced prompt with all settings
      const finalPrompt = currentSettings ? buildEnhancedPrompt(prompt, currentSettings) : prompt
      const modelName = currentSettings?.model || selectedModel
      const modelId = modelIdMap[modelName]
      
      console.log("🚀 Starting progressive image-to-image generation...")
      console.log("📝 Enhanced prompt:", finalPrompt)
      console.log("🎯 Selected model:", modelName)
      console.log("🆔 Model ID:", modelId)
      console.log("📸 Uploaded image:", uploadedImage ? "Yes" : "No")
      console.log("⚙️ Using settings:", currentSettings)

      // Check if it's a Flux model (ID 6 for Max, ID 7 for Pro)
      if (modelId === 6 || modelId === 7) {
        console.log(`🎯 Using Flux Kontext ${modelId === 6 ? 'Max' : 'Pro'} (ID: ${modelId})`)
        
        if (!uploadedImage) {
          alert("Please upload an image for image-to-image generation.")
          setIsGenerating(false)
          return
        }

        // Convert uploaded image to base64
        const base64Image = await fileToBase64(uploadedImage)
        
        // For Flux models, we need to use aspect ratios between 21:9 and 9:21
        // All our aspect ratios are now Flux-compatible
        const aspectRatio = currentSettings?.aspectRatio || selectedAspectRatio
        const fluxAspectRatio = aspectRatio

        // For Flux models, we don't need to calculate width/height
        // The API will handle the resolution based on the aspect ratio
        console.log(`🎯 Using Flux aspect ratio: ${fluxAspectRatio}`)

        try {
          // Use the regular generate-image endpoint
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: finalPrompt,
              modelId: modelId,
              aspect_ratio: fluxAspectRatio,
              input_image: base64Image,
              num_images: numberOfImages,
              output_format: 'png',
              prompt_upsampling: false,
              safety_tolerance: 2,
              seed: Math.floor(Math.random() * 1000000)
            }),
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error(`❌ Flux API error:`, errorText)
            throw new Error(`Flux API error: ${response.status}`)
          }

          const data = await response.json()
          console.log(`✅ Flux ${modelId === 6 ? 'Max' : 'Pro'} generation successful:`, { 
            hasImageUrls: !!data.image_urls,
            imageCount: data.image_urls?.length,
            model: data.metadata?.model 
          })
          
          if (data.image_urls && data.image_urls.length > 0) {
            setGeneratedImages(data.image_urls)
          } else {
            throw new Error("No image URLs received from Flux API")
          }
          
        } catch (error) {
          console.error(`❌ Flux API failed:`, error)
          alert(`Generation failed: ${error}`)
        } finally {
          setIsGenerating(false)
        }
      } else {
        // Handle regular models (existing logic)
        const resolutionMap: Record<string, Record<string, [number, number]>> = {
          "1:1": {
            SD: [512, 512],
            HD: [768, 768],
            FullHD: [1024, 1024],
            "2K": [2048, 2048],
          },
          "16:9": {
            SD: [640, 360],
            HD: [1280, 720],
            FullHD: [1920, 1080],
            "2K": [2560, 1440],
          },
          "9:16": {
            SD: [360, 640],
            HD: [720, 1280],
            FullHD: [1080, 1920],
            "2K": [1440, 2560],
          },
          "4:3": {
            SD: [512, 384],
            HD: [768, 576],
            FullHD: [1024, 768],
            "2K": [2048, 1536],
          },
        }

        let [width, height] = resolutionMap[selectedAspectRatio]?.[selectedQuality] || [768, 768]
        // Ensure width and height are divisible by 16
        width = width - (width % 16)
        height = height - (height % 16)

        // Call the API
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: finalPrompt,
            width,
            height,
            num_images: numberOfImages,
            model: selectedModel,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate images')
        }

        const data = await response.json()
        setGeneratedImages(data.image_urls || [])
      }
    } catch (error) {
      console.error('Generation failed:', error)
      // Fallback to placeholder images for demo
      const placeholderImages = Array(numberOfImages).fill("/placeholder.svg?height=400&width=400")
      setGeneratedImages(placeholderImages)
    } finally {
      setIsGenerating(false)
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleSettingsSave = (settingsData: SettingsData) => {
    setCurrentSettings(settingsData)
    console.log("Settings saved:", settingsData)
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StableBackground />
        <NavigationFull />
        <div className="flex flex-row relative" style={{ minHeight: 'calc(100vh - 64px - 64px)', marginTop: '64px' }}>
          <SettingsPanel
            onClose={() => {}} // No-op since we want it always open
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
            onSave={handleSettingsSave}
            className="w-[340px] max-h-[calc(100vh-128px)] overflow-y-auto sticky top-[64px] z-30 border-r border-[#222]"
          />
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8">
              <Header title="Image to Image" />
              <InputSection
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generatedImages={generatedImages}
                selectedModel={selectedModel}
                selectedStyle={selectedStyle}
                selectedQuality={selectedQuality}
                selectedAspectRatio={selectedAspectRatio}
                numberOfImages={numberOfImages}
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
