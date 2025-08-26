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
  const [selectedModel, setSelectedModel] = useState("Flux Krea")
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

      // Map resolution is no longer needed for backend route, but keep for potential UI sizing if required
      // Call the backend API
      const API_BASE =
        process.env.NEXT_PUBLIC_BACKEND_KONTEXT || 'https://5be68d59f2c1.ngrok-free.app';

      const response = await fetch(`${API_BASE}/generate-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          num_images: numberOfImages,
          model: selectedModel,
          frame_size: selectedAspectRatio,
          quality: selectedQuality,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate images')
      }

      const data = await response.json()

      if (data.image_urls && data.image_urls.length > 0) {
        const imageUrls = data.image_urls.map((url: string) => {
          const fullUrl = `${API_BASE}${url}`
          return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`
        })
        setGeneratedImages(imageUrls)
      } else {
        throw new Error('No images received from backend.')
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



  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StableBackground />
        <NavigationFull />
        <div className="">
          <div className="flex flex-row relative" >
            <SettingsPanel
              onClose={() => { }} // No-op since we want it always open
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
              className="md:w-[400px] md:max-w-[400px] lg:w-[480px] lg:max-w-[480px] flex-shrink-0 border-r border-[#222] pt-16"
            />
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
              <div className="w-full max-w-5xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8 mx-auto py-8">
                <div className="w-full bg-black/50 backdrop-blur-sm  px-4">
                  <Header title="Product Generation" />
                </div>
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
      </div>
      <Footer />
    </>
  )
}
