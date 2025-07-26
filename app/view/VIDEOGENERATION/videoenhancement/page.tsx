"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

export default function VideoEnhancement() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion 3.5 Large")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1")
  const [selectedQuality, setSelectedQuality] = useState("HD")

  const resolutionMap: Record<string, Record<string, [number, number]>> = {
    "1:1": { "HD": [768, 768], "4K": [1024, 1024] },
    "16:9": { "HD": [1344, 768], "4K": [1920, 1080] },
    "9:16": { "HD": [768, 1344], "4K": [1080, 1920] },
    "2:3": { "HD": [512, 768], "4K": [768, 1152] },
    "3:2": { "HD": [768, 512], "4K": [1152, 768] },
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const finalPrompt = prompt

      let [width, height] = resolutionMap[selectedAspectRatio]?.[selectedQuality] || [768, 768]
      width = width - (width % 16)
      height = height - (height % 16)

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          width,
          height,
          num_videos: 1,
          model: selectedModel,
          type: 'video-enhancement'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate video')
      }

      const data = await response.json()
      setGeneratedImages(data.video_urls || [])
    } catch (error) {
      console.error('Video generation failed:', error)
      const placeholderVideo = ["/placeholder-video.mp4"]
      setGeneratedImages(placeholderVideo)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  return (
    <>
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/newt2image/bg.png" alt="background" width={1920} height={1080} className="w-auto h-auto md:-mt-48 object-contain" />
      </div>
      <NavigationFull />

      <div className="relative z-10">
        <Header title="Video Enhancement" />

        <main className="container mx-auto lg:px-8 xl:px-12 2xl:px-16">
          <InputSection
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            onSettingsToggle={handleSettingsToggle}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            selectedModel={selectedModel}
            selectedStyle={null}
            selectedQuality={selectedQuality}
            selectedAspectRatio={selectedAspectRatio}
            numberOfImages={1}
          />
        </main>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedAspectRatio={selectedAspectRatio}
        setSelectedAspectRatio={setSelectedAspectRatio}
        selectedQuality={selectedQuality}
        setSelectedQuality={setSelectedQuality}
      />
    </div>
    <Footer />
    </>
  )
}