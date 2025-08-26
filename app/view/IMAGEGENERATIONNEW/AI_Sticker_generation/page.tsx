"use client"

import React, { useState, useEffect } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
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

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Handle overlay state changes
  const handleOverlayOpen = () => {
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  // Robust global scroll lock when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      return () => {
        document.documentElement.style.overflow = '';
        const top = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(top || '0') * -1);
      };
    } else {
      // ensure styles are reset if toggled quickly
      document.documentElement.style.overflow = '';
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      if (top) {
        window.scrollTo(0, parseInt(top || '0') * -1);
      }
    }
  }, [isOverlayOpen]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGeneratedImages([])
    
    try {
      if (!prompt.trim()) {
        alert('Please enter a prompt for sticker generation.');
        setIsGenerating(false);
        return;
      }

      // Build prompt with sticker type if provided
      const finalPrompt = stickerType ? `${prompt}, ${stickerType} type` : prompt;

      // Sticker generation parameters
      const stickerParams = {
        prompt: finalPrompt,
        num_images: numberOfStickers,
        model: "Flux Krea",
        frame_size: "1:1",
        quality: saveFileType || "HD",
        style_palette: stickerType || "Realistic"
      };

      // Updated endpoint to use the unified /generate endpoint like logo generation
      const API_BASE =
        process.env.NEXT_PUBLIC_BACKEND_KONTEXT || 'https://5be68d59f2c1.ngrok-free.app';
      // Route to sticker-specific backend endpoint
      const response = await fetch(`${API_BASE}/generate-sticker`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stickerParams),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to backend.');
      }

      const data = await response.json();

      console.log('Backend response:', data);

      if (data.image_urls && data.image_urls.length > 0) {
        // Use image proxy to bypass ngrok warning page
        const imageUrls = data.image_urls.map((url: string) => {
          // The backend returns URLs like "/download/filename.png"
          // We need to construct the full ngrok URL
          const fullUrl = `${API_BASE}${url}`;
          return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`;
        });
        console.log('Generated image URLs:', imageUrls);
        setGeneratedImages(imageUrls);
      } else {
        console.error('No image URLs in response:', data);
        throw new Error('No images received from backend.');
      }
    } catch (error) {
      console.error('Generation failed:', error)
      const fallback = Array(numberOfStickers).fill('/placeholder.svg');
      setGeneratedImages(fallback);
    } finally {
      setIsGenerating(false)
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
            stickerType={stickerType}
            setStickerType={setStickerType}
            numberOfStickers={numberOfStickers}
            setNumberOfStickers={setNumberOfStickers}
            saveFileType={saveFileType}
            setSaveFileType={setSaveFileType}
            expression={expression}
            setExpression={setExpression}
            className="md:w-[400px] md:max-w-[400px] lg:w-[480px] lg:max-w-[480px] flex-shrink-0 border-r border-[#222]"
          />

          {/* Main Content Area - Single scrollable container */}
          <div className={`flex-1 min-h-screen ${isOverlayOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className="pt-20 w-full max-w-5xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8 mx-auto py-8">
              {/* Header - Fixed at top of content area */}
              <div className="w-full bg-black/50 backdrop-blur-sm py-8 px-4">
                <Header title="Sticker Generator" />
              </div>

              {/* Content - Scrollable */}
              <div className="w-full flex flex-col items-center gap-8 min-h-[400px]">
                <InputSection
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  generatedImages={generatedImages}
                  stickerType={stickerType}
                  setStickerType={setStickerType}
                  numberOfStickers={numberOfStickers}
                  setNumberOfStickers={setNumberOfStickers}
                  saveFileType={saveFileType}
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
