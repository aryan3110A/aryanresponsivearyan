"use client"

import React, { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"

export default function AISTICKERGEN() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
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
      const finalPrompt = stickerType ? `${prompt}, ${stickerType} type` : prompt
      const width = 512
      const height = 512
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, width, height, num_images: numberOfStickers }),
      })
      if (!response.ok) throw new Error('Failed to generate images')
      const data = await response.json()
      setGeneratedImages(data.image_urls || [])
    } catch (error) {
      console.error('Generation failed:', error)
      const placeholderImages = Array(numberOfStickers).fill("/placeholder.svg?height=400&width=400")
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
            isOpen={true}
            onClose={() => {}} // No-op since we want it always open
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
            className="w-[340px] max-h-[calc(100vh-128px)] overflow-y-auto sticky top-[64px] z-30 border-r border-[#222]"
          />
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8">
              <Header title="Sticker Generator" />
              <InputSection
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generatedImages={generatedImages}
                stickerType={stickerType}
                numberOfStickers={numberOfStickers}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
