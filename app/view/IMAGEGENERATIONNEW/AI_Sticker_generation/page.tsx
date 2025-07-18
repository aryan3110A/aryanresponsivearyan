"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

export default function AISTICKERGEN() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [stickerType, setStickerType] = useState<string | null>(null)
  const [numberOfStickers, setNumberOfStickers] = useState(1)
  const [saveFileType, setSaveFileType] = useState<string | null>(null);
  const [expression, setExpression] = useState<string | null>(null);
  const [promptEnhance, setPromptEnhance] = useState<string>("Auto");

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Prepare the final prompt with style if selected
      const finalPrompt = stickerType ? `${prompt}, ${stickerType} type` : prompt
      
      // Use default resolution for stickers
      const width = 512
      const height = 512

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
          num_images: numberOfStickers,
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
      const placeholderImages = Array(numberOfStickers).fill("/placeholder.svg?height=400&width=400")
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/newt2image/bg.png" alt="background" width={1920} height={1080} className="w-auto h-auto  md:-mt-48  object-contain " />
      </div>
      <NavigationFull />
      {/* <BackgroundShapes /> */}

      <div className="relative z-10">
        <Header title="AI Sticker Generator" />

        <main className="container mx-auto  lg:px-8 xl:px-12 2xl:px-16">
          <InputSection
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            onSettingsToggle={handleSettingsToggle}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            stickerType={stickerType}
            setStickerType={setStickerType}
            numberOfStickers={numberOfStickers}
            setNumberOfStickers={setNumberOfStickers}
          />
        </main>

        
      </div>
      

      <SettingsPanel
      
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        stickerType={stickerType}
        setStickerType={setStickerType}
        numberOfStickers={numberOfStickers}
        setNumberOfStickers={setNumberOfStickers}
        saveFileType={saveFileType}
        setSaveFileType={setSaveFileType}
        expression={expression}
        setExpression={setExpression}
        promptEnhance={promptEnhance}
        setPromptEnhance={setPromptEnhance}
      />
      
    </div>
    <Footer />
    </>
  )
}
