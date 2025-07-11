"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import ImageOverlay from "./componennts/ImageOverlay"

export default function AddMusicInVideo() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Demo overlay state
  const [showDemoOverlay, setShowDemoOverlay] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Prepare the final prompt with style if selected
      const finalPrompt = prompt
      
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

      let [width, height] = resolutionMap["1:1"]?.["HD"] || [768, 768]
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
          num_images: 1,
          model: "Stable Diffusion 3.5 Large",
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
      const placeholderImages = Array(1).fill("/placeholder.svg?height=400&width=400")
      setGeneratedImages(placeholderImages)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  return (
    <>
    {/* DEMO: Show ImageOverlay with dummy data */}
    
    {showDemoOverlay && (
      <ImageOverlay
        isOpen={true}
        onClose={() => setShowDemoOverlay(false)}
        imageUrl="/Landingpage/ArtGallery/img1.png"
        prompt="pink cat in the garden"
        model="Flux Kontext"
        musicType="Classic"
      />
    )}
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/newt2image/bg.png" alt="background" width={1920} height={1080} className="w-auto h-auto  md:-mt-48  object-contain " />
      </div>
      <NavigationFull />
      {/* <BackgroundShapes /> */}

      <div className="relative z-10">
        <Header title="Add Music In Video" />

        <main className="container mx-auto  lg:px-8 xl:px-12 2xl:px-16">
          
          <InputSection
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            onSettingsToggle={handleSettingsToggle}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
          />
        </main>

        
      </div>
      

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
    </div>
    <Footer />
    </>
  )
}

