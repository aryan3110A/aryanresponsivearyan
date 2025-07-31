"use client";

import { useState } from "react";
import { Header } from "../UI";
import InputSection from "./componennts/InputSection";
import SettingsPanel from "./componennts/SettingsPanel";
import Image from "next/image";
import NavigationFull from "../../Core/NavigationFull";
import Footer from "../../Core/Footer";

export default function ProductWithModelPosePage() {
  const [generatedPrompt] = useState("professional logo mockup");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedFont, setSelectedFont] = useState("Inter");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selectedQuality, setSelectedQuality] = useState("HD");
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessTagline, setBusinessTagline] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      if (!logoFile || !businessName.trim()) {
        alert("Please upload a logo and provide a business name.");
        setIsGenerating(false);
        return;
      }

      // const resolutionMap: Record<string, Record<string, [number, number]>> = {
      //   "1:1": { SD: [512, 512], HD: [768, 768], FullHD: [1024, 1024], "2K": [2048, 2048] },
      //   "16:9": { SD: [640, 360], HD: [1280, 720], FullHD: [1920, 1080], "2K": [2560, 1440] },
      //   "2:3": { SD: [384, 576], HD: [512, 768], FullHD: [768, 1152], "2K": [1024, 1536] },
      //   "9:16": { SD: [360, 640], HD: [720, 1280], FullHD: [1080, 1920], "2K": [1440, 2560] },
      //   "4:3": { SD: [512, 384], HD: [768, 576], FullHD: [1024, 768], "2K": [2048, 1536] },
      //   "3:4": { SD: [384, 512], HD: [576, 768], FullHD: [768, 1024], "2K": [1536, 2048] },
      //   "Custom": { SD: [768, 768], HD: [1024, 1024], FullHD: [1280, 1280], "2K": [2048, 2048] },
      // };

      // let [width, height] = resolutionMap[selectedAspectRatio]?.[selectedQuality] || [768, 768];
      // width -= width % 16;
      // height -= height % 16;

      const formData = new FormData();
      formData.append("logo_file", logoFile);
      formData.append("business_name", businessName);
      formData.append("business_tagline", businessTagline);

      const response = await fetch("https://8a6fc092d30c.ngrok-free.app/generate_step", {
        method: "POST",
        body: formData,
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to backend.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        for (const chunk of chunks) {
          if (chunk.startsWith("data: ")) {
            try {
              const json = JSON.parse(chunk.replace("data: ", ""));
              setGeneratedImages((prev) => [...prev, `https://8a6fc092d30c.ngrok-free.app${json.image_url}`]);
            } catch {
              console.warn("Invalid JSON chunk:", chunk);
            }
          }
        }

        buffer = chunks[chunks.length - 1]; // save leftover
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
          <Header title="Mockup Generation" />
          <main className="container mx-auto lg:px-8 xl:px-12 2xl:px-16">
            <InputSection
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
              logoFile={logoFile}
              setLogoFile={setLogoFile}
              businessName={businessName}
              setBusinessName={setBusinessName}
              businessTagline={businessTagline}
              setBusinessTagline={setBusinessTagline}
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
