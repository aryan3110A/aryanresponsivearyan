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
      const response = await fetch('https://6debd752a0c4.ngrok-free.app/generate', {
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
          const fullUrl = `https://6debd752a0c4.ngrok-free.app${url}`;
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
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StableBackground />
        <NavigationFull />
        <div className="flex w-full    h-screen" style={{ marginTop: '64px' }}>
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
            className="md:w-[400px] md:max-w-[400px] lg:w-[480px] lg:max-w-[480px] max-h-[calc(100vh-128px)] overflow-y-auto sticky z-30 border-r border-[#222]"
          />
          <div className="flex-1 h-full overflow-y-auto flex justify-center">
            <div className="w-full max-w-5xl flex flex-col items-center justify-center px-2 sm:px-4 gap-8 mx-auto">
              <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm py-4 w-full">
                <Header title="Logo Generator" />
              </div>
              <div className="w-full flex flex-col items-center gap-8 min-h-[400px]">
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
    </>
  );
}
