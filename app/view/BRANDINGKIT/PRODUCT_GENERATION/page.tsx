"use client"

import React, { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"

import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"

export default function ProductGeneration() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion 3.5 Large")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [numberOfImages, setNumberOfImages] = useState(1)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Prepare the final prompt with style if selected
      const finalPrompt = selectedStyle ? `${prompt}, ${selectedStyle} style` : prompt
      
      // Get resolution based on aspect ratio and quality
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
    } catch (error) {
      console.error('Generation failed:', error)
      // Fallback to placeholder images for demo
      const placeholderImages = Array(numberOfImages).fill("/placeholder.svg?height=400&width=400")
      setGeneratedImages(placeholderImages)
    } finally {
      setIsGenerating(false)
    }
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
            className="w-[340px] max-h-[calc(100vh-128px)] overflow-y-auto sticky top-[64px] z-30 border-r border-[#222]"
          />
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8">
              <Header title="Product Generation" />
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
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
