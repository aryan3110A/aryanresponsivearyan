"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

export default function NewTextToVideo() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("MiniMax-Hailuo-02")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [selectedDuration, setSelectedDuration] = useState(6)
  const [selectedCameraMovements, setSelectedCameraMovements] = useState<string[]>([])
  const [firstFrameImage, setFirstFrameImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      // Build the final prompt with camera movements for Director models
      let finalPrompt = prompt
      if (selectedCameraMovements.length > 0 && selectedModel.includes("Director")) {
        const cameraInstructions = selectedCameraMovements.map(movementId => {
          const movement = require('./componennts/videoModels').CAMERA_MOVEMENTS.find((m: any) => m.id === movementId)
          return movement?.instruction
        }).filter(Boolean).join(', ')

        if (cameraInstructions) {
          finalPrompt = `${prompt} ${cameraInstructions}`
        }
      }

      // Call the API for video generation
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          model: selectedModel,
          selectedAspectRatio: selectedAspectRatio,
          selectedQuality: selectedQuality,
          duration: selectedDuration,
          first_frame_image: firstFrameImage,
          group_id: "default_group" // You may need to configure this
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await response.json()

      if (data.success && data.video_urls && data.video_urls.length > 0) {
        setGeneratedImages(data.video_urls)
      } else {
        throw new Error(data.error || 'No video URLs in response')
      }
    } catch (error) {
      console.error('Video generation failed:', error)
      // Show error to user
      alert(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Fallback to placeholder video for demo
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
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/newt2image/bg.png" alt="background" width={1920} height={1080} className="w-auto h-auto  md:-mt-48  object-contain " />
      </div>
      <NavigationFull />
      {/* <BackgroundShapes /> */}

      <div className="relative z-10">
        <Header title="Text to VIDEO Generator" />

        <main className="container mx-auto  lg:px-8 xl:px-12 2xl:px-16">
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
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        selectedCameraMovements={selectedCameraMovements}
        setSelectedCameraMovements={setSelectedCameraMovements}
        firstFrameImage={firstFrameImage}
        setFirstFrameImage={setFirstFrameImage}
      />
      
    </div>
    <Footer />
    </>
  )
}
