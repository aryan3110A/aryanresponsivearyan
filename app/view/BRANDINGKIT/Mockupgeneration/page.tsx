"use client";

import React, { useState } from "react";
import { Header } from "../UI";
import InputSection from "./componennts/InputSection";
import SettingsPanel from "./componennts/SettingsPanel";

import NavigationFull from "../../Core/NavigationFull";
import Footer from "../../Core/Footer";
import StableBackground from "../../Core/StableBackground";

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

      const formData = new FormData();
      formData.append("logo_file", logoFile);
      formData.append("business_name", businessName);
      formData.append("business_tagline", businessTagline);

      // Updated endpoint to use the unified /generate endpoint
        const API_BASE = process.env.NEXT_PUBLIC_BACKEND_KONTEXT || 'https://bc5361767552.ngrok-free.app';
      const response = await fetch(`${API_BASE}/generate`, {
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
              // Use image proxy to bypass ngrok warning page
              setGeneratedImages((prev) => [...prev, `/api/image-proxy?url=${API_BASE}${json.image_url}`]);
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
        {/* Background Particles */}
        <StableBackground />

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