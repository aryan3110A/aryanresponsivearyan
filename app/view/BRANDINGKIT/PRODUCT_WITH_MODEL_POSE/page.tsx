// Backend API now uses ngrok for remote access: https://9fbe9881d16c.ngrok-free.app
"use client";

import { useState } from "react";
import { Header } from "../UI";
import InputSection from "./componennts/InputSection";
import SettingsPanel from "./componennts/SettingsPanel";
import Image from "next/image";
import NavigationFull from "../../Core/NavigationFull";
import Footer from "../../Core/Footer";

export default function ProductWithModelPosePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState(""); // Store the prompt used for generation
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedFont, setSelectedFont] = useState("Inter");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selectedQuality, setSelectedQuality] = useState("HD");
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Store the current prompt as the generated prompt
    setGeneratedPrompt(prompt);

    try {
      if (!modelImage || !productImage) {
        alert("Please upload both model and product images.");
        setIsGenerating(false);
        return;
      }

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
        "2:3": {
          SD: [384, 576],
          HD: [512, 768],
          FullHD: [768, 1152],
          "2K": [1024, 1536],
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
        "3:4": {
          SD: [384, 512],
          HD: [576, 768],
          FullHD: [768, 1024],
          "2K": [1536, 2048],
        },
        "Custom": {
          SD: [768, 768],
          HD: [1024, 1024],
          FullHD: [1280, 1280],
          "2K": [2048, 2048],
        },
      };

      let [width, height] = resolutionMap[selectedAspectRatio]?.[selectedQuality] || [768, 768];
      // Ensure width and height are divisible by 16 for better compatibility
      width = width - (width % 16);
      height = height - (height % 16);

      console.log(`Generating ${numberOfImages} images with aspect ratio: ${selectedAspectRatio}, quality: ${selectedQuality}, resolution: ${width}x${height}`);

      const formData = new FormData();
      formData.append("model_image", modelImage);
      formData.append("product_image", productImage);
      formData.append("scene_desc", prompt); // User's custom prompt only
      formData.append("numberOfImages", numberOfImages.toString());
      formData.append("width", width.toString());
      formData.append("height", height.toString());

      const response = await fetch("https://9fbe9881d16c.ngrok-free.app/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to generate image.");
      }

      // Handle both single image and multiple images response
      if (data.image_urls) {
        // Multiple images
        setGeneratedImages(data.image_urls.map((url: string) => `https://9fbe9881d16c.ngrok-free.app${url}`));
      } else if (data.image_url) {
        // Single image (backward compatibility)
        setGeneratedImages([`https://9fbe9881d16c.ngrok-free.app${data.image_url}`]);
      } else {
        throw new Error("No image URLs received.");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const fallback = Array(numberOfImages).fill("/placeholder.svg");
      setGeneratedImages(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/newt2image/bg.png"
            alt="background"
            width={1920}
            height={1080}
            className="w-auto h-auto md:-mt-48 object-contain"
          />
        </div>
        <NavigationFull />

        <div className="relative z-10">
          <Header title="Product With Model Pose" />

          <main className="container mx-auto lg:px-8 xl:px-12 2xl:px-16">
            <InputSection
              prompt={prompt}
              setPrompt={setPrompt}
              generatedPrompt={generatedPrompt}
              onGenerate={handleGenerate}
              onSettingsToggle={handleSettingsToggle}
              isGenerating={isGenerating}
              generatedImages={generatedImages}
              selectedFont={selectedFont}
              selectedStyle={selectedStyle}
              selectedQuality={selectedQuality}
              selectedAspectRatio={selectedAspectRatio}
              numberOfImages={numberOfImages}
              modelImage={modelImage}
              setModelImage={setModelImage}
              productImage={productImage}
              setProductImage={setProductImage}
            />
          </main>
        </div>

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
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
  );
}
