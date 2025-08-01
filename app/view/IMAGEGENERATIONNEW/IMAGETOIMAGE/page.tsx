"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

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

export default function ImageToImage() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("Flux.1 KONTEXT MAX")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    try {
      // Prepare the final prompt with style if selected
      const finalPrompt = selectedStyle ? `${prompt}, ${selectedStyle} style` : prompt
      const modelId = modelIdMap[selectedModel]
      
      console.log("🚀 Starting image-to-image generation...")
      console.log("📝 Prompt:", finalPrompt)
      console.log("🎯 Selected model:", selectedModel)
      console.log("🆔 Model ID:", modelId)
      console.log("📸 Uploaded image:", uploadedImage ? "Yes" : "No")

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
        
        const aspectRatio = selectedAspectRatio
        const quality = selectedQuality
        let width = 768, height = 768
        if (aspectRatio === "16:9") {
          width = quality === "4K" ? 1920 : 1024
          height = quality === "4K" ? 1080 : 576
        } else if (aspectRatio === "9:16") {
          width = quality === "4K" ? 1080 : 576
          height = quality === "4K" ? 1920 : 1024
        }

        try {
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: finalPrompt,
              modelId: modelId,
              aspect_ratio: `${width}:${height}`,
              input_image: base64Image,
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
            hasImageUrl: !!data.imageUrl,
            model: data.metadata?.model 
          })
          
          if (data.imageUrl) {
            setGeneratedImages([data.imageUrl])
          } else {
            throw new Error("No image URL received from Flux API")
          }
        } catch (error) {
          console.error(`❌ Flux API failed:`, error)
          throw error
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
        <Header title="Image to Image Generator" />

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
            numberOfImages={numberOfImages}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
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
        numberOfImages={numberOfImages}
        setNumberOfImages={setNumberOfImages}
      />
      
    </div>
    <Footer />
    </>
  )
}
