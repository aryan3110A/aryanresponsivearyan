'use client';

import React, { useState } from 'react';
import { Header } from '../../IMAGEGENERATIONNEW/UI';
import InputSection from './componennts/InputSection';
import SettingsPanel from './componennts/SettingsPanel';
// import BackgroundShapes from "./componennts/BackgroundShapes"

import NavigationFull from '../../Core/NavigationFull';
import Footer from '../../Core/Footer';
import StableBackground from '../../Core/StableBackground';

export default function LogoGeneration() {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberOfImages, setNumberOfImages] = useState(1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      if (!prompt.trim()) {
        alert('Please enter a prompt for logo generation.');
        setIsGenerating(false);
        return;
      }

      // Updated endpoint to use the unified /generate endpoint
      const API_BASE =
        process.env.NEXT_PUBLIC_BACKEND_KONTEXT || 'https://2db768471a14.ngrok-free.app';
      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          num_images: numberOfImages,
        }),
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
      console.error('Generation failed:', error);
      const fallback = Array(numberOfImages).fill('/placeholder.svg');
      setGeneratedImages(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white relative">
        <StableBackground />
        <NavigationFull />

        {/* Main Content Container - Single scrollable area */}
        <div className="flex w-full min-h-screen pt-16">
          {/* Settings Panel - Fixed width, no scrolling */}
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
            numberOfLogo={numberOfImages}
            setNumberOfLogo={setNumberOfImages}
            className="md:w-[400px] md:max-w-[400px] lg:w-[480px] lg:max-w-[480px] flex-shrink-0 border-r border-[#222]"
          />

          {/* Main Content Area - Single scrollable container */}
          <div className="flex-1 min-h-screen overflow-y-auto">
            <div className="w-full max-w-5xl flex flex-col items-center mx-auto">
              {/* Header - Fixed at top of content area */}
              <div className="w-full bg-black/50 backdrop-blur-sm py-4 px-4">
                <Header title="Logo Generator" />
              </div>

              {/* Content - Scrollable */}
              <div className="w-full flex flex-col items-center gap-8 px-4 py-8">
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
                  numberOfLogo={numberOfImages}
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
  );
}
