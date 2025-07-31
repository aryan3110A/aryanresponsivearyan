"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

export default function LOGOGENERATION() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion 3.5 Large")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [numberOfLogo, setNumberOfLogo] = useState(1)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Prepare the final prompt with style if selected
      const finalPrompt = selectedStyle ? `${prompt}, ${selectedStyle} style` : prompt
      
      // Call the API
      const response = await fetch('https://8a6fc092d30c.ngrok-free.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          num_images: numberOfLogo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate images')
      }

      const data = await response.json()
      if (data.image_urls) {
          setGeneratedImages(data.image_urls.map((url: string) => `https://8a6fc092d30c.ngrok-free.app${url}`));
      } else {
        setGeneratedImages([]);
      }
    } catch (error) {
      console.error('Generation failed:', error)
      // Fallback to placeholder images for demo
      const placeholderImages = Array(numberOfLogo).fill("/placeholder.svg?height=400&width=400")
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
        <Header title="LOGO Generation" />

        <main className="container mx-auto  lg:px-8 xl:px-12 2xl:px-16">
          
          <InputSection
            prompt={prompt}
            setPrompt={setPrompt} 
            onGenerate={handleGenerate}
            onSettingsToggle={handleSettingsToggle}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            selectedModel={selectedModel}
            selectedStyle={selectedStyle}
            selectedQuality={selectedQuality}
            selectedAspectRatio={selectedAspectRatio}
            numberOfLogo={numberOfLogo}
          />
        </main>

        
      </div>
      

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        selectedAspectRatio={selectedAspectRatio}
        setSelectedAspectRatio={setSelectedAspectRatio}
        selectedQuality={selectedQuality}
        setSelectedQuality={setSelectedQuality}
        numberOfLogo={numberOfLogo}
        setNumberOfLogo={setNumberOfLogo}
      />
      
    </div>
    <Footer />
    </>
  )
}
