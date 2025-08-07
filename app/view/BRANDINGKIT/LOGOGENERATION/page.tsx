"use client"

import React, { useState } from "react"
import { Header } from "../../IMAGEGENERATIONNEW/UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"

import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"

export default function LogoGeneration() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages] = useState<string[]>([])
  const [isGenerating] = useState(false)
  // Add other state as needed for your logo generation logic

  const handleGenerate = async () => {
    // Your logo generation logic here
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StableBackground />
        <NavigationFull />
        <div className="flex flex-row relative" style={{ minHeight: 'calc(100vh - 64px - 64px)', marginTop: '64px' }}>
                  <SettingsPanel
          onClose={() => {}} // No-op since we want it always open
            // Add required props here based on the interface
            selectedModel=""
            setSelectedModel={() => {}}
            selectedStyle={null}
            setSelectedStyle={() => {}}
            selectedAspectRatio="1:1"
            setSelectedAspectRatio={() => {}}
            selectedQuality="HD"
            setSelectedQuality={() => {}}
            numberOfLogo={1}
            setNumberOfLogo={() => {}}
            className="w-[340px] max-h-[calc(100vh-128px)] overflow-y-auto sticky top-[64px] z-30 border-r border-[#222]"
          />
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8">
              <Header title="Logo Generator" />
              <InputSection
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generatedImages={generatedImages}
                selectedModel=""
                selectedStyle={null}
                selectedQuality="HD"
                selectedAspectRatio="1:1"
                numberOfLogo={1}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
