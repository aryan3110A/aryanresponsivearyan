"use client"

import React, { useState, useEffect, useRef } from "react"
import { Header } from "../UI"
import InputSection from "./components/InputSection"
import SettingsPanel from "./components/SettingsPanel"
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"

export default function ImageUpscale() {
  const [prompt, setPrompt] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [upscaleFactor, setUpscaleFactor] = useState<number>(2)
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [saveFileType, setSaveFileType] = useState<string | null>(null)
  const [quality, setQuality] = useState<string>("HD")

  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle overlay state changes
  const handleOverlayOpen = () => {
    setIsOverlayOpen(true)
  }

  const handleOverlayClose = () => {
    setIsOverlayOpen(false)
  }

  // Robust global scroll lock when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      const scrollY = window.scrollY
      document.documentElement.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'

      return () => {
        document.documentElement.style.overflow = ''
        const top = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.width = ''
        window.scrollTo(0, parseInt(top || '0') * -1)
      }
    } else {
      // ensure styles are reset if toggled quickly
      document.documentElement.style.overflow = ''
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      if (top) {
        window.scrollTo(0, parseInt(top || '0') * -1)
      }
    }
  }, [isOverlayOpen])

  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first.')
      return
    }
    
    setIsGenerating(true)
    setGeneratedImages([])
    
    try {
      // Use the same ngrok base as sticker generation
      const API_BASE = 'https://9547e0f83000.ngrok-free.app'
      
      // Create FormData for file upload (backend expects form data, not JSON)
      const formData = new FormData()
      formData.append('image', uploadedImage)
      formData.append('target_long_side', (upscaleFactor * 512).toString()) // Convert upscale factor to target size
      formData.append('steps', '50') // Default steps
      formData.append('guidance_scale', '3.5') // Default guidance
      
      // Route to upscale-specific backend endpoint
      const response = await fetch(`${API_BASE}/generate/upscale`, {
        method: 'POST',
        body: formData, // Send FormData instead of JSON
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend error response:', errorText)
        throw new Error(`Backend error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      console.log('Backend response:', data)

      if (data.image_url) {
        // Backend returns single image_url, not array
        const fullUrl = `${API_BASE}${data.image_url}`
        const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`
        console.log('Generated upscaled image URL:', proxiedUrl)
        setGeneratedImages([proxiedUrl]) // Set as single item array
      } else {
        console.error('No image URL in response:', data)
        throw new Error('No image received from backend.')
      }
    } catch (error) {
      console.error('Upscaling failed:', error)
      const fallback = Array(numberOfImages).fill('/placeholder.svg')
      setGeneratedImages(fallback)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedImage(file)
      } else {
        alert('Please select a valid image file.')
      }
    }
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StableBackground />
        <NavigationFull />

        {/* Main Content Container - Single scrollable area */}
        <div className="flex w-full min-h-screen">
          {/* Settings Panel - Fixed width, no scrolling */}
          <SettingsPanel
            onClose={() => {}} // No-op since we want it always open
            upscaleFactor={upscaleFactor}
            setUpscaleFactor={setUpscaleFactor}
            numberOfImages={numberOfImages}
            setNumberOfImages={setNumberOfImages}
            saveFileType={saveFileType}
            setSaveFileType={setSaveFileType}
            quality={quality}
            setQuality={setQuality}
            className="md:w-[400px] md:max-w-[400px] lg:w-[480px] lg:max-w-[480px] flex-shrink-0 border-r border-[#222]"
          />

          {/* Main Content Area - Single scrollable container */}
          <div className={`flex-1 min-h-screen ${isOverlayOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className="pt-20 w-full max-w-5xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8 mx-auto py-8">
              {/* Header - Fixed at top of content area */}
              <div className="w-full bg-black/50 backdrop-blur-sm py-8 px-4">
                <Header title="Image Upscaler" />
              </div>

              {/* Content - Scrollable */}
              <div className="w-full flex flex-col items-center gap-8 min-h-[400px]">
                <InputSection
                  prompt={prompt}
                  setPrompt={setPrompt}
                  uploadedImage={uploadedImage}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={removeUploadedImage}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  generatedImages={generatedImages}
                  upscaleFactor={upscaleFactor}
                  numberOfImages={numberOfImages}
                  quality={quality}
                  onOverlayOpen={handleOverlayOpen}
                  onOverlayClose={handleOverlayClose}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Add CSS to ensure proper page scrolling */}
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }

        /* Ensure the main page scrolls properly */
        body {
          scroll-behavior: smooth;
        }

        /* Hide any unwanted scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  )
}
