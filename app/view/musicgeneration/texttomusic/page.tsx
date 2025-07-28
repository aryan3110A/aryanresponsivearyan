"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./components/InputSection"
import SettingsPanel from "./components/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

export default function TextToMusic() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  // Music generation specific states
  const [selectedModel, setSelectedModel] = useState<string>("music-1.5")
  const [sampleRate, setSampleRate] = useState<number>(44100)
  const [bitrate, setBitrate] = useState<number>(256000)
  const [audioFormat, setAudioFormat] = useState<string>("mp3")
  const [promptEnhance, setPromptEnhance] = useState<string>("Auto")
  const [lyrics, setLyrics] = useState<string>("")
  const [songStructure, setSongStructure] = useState<string[]>(["verse", "chorus", "verse", "chorus", "bridge", "chorus"])

  const handleGenerate = async () => {
    if (!prompt.trim() || !lyrics.trim()) {
      alert("Please provide both prompt and lyrics")
      return
    }

    setIsGenerating(true)

    try {
      // Create structured lyrics by combining user lyrics with song structure
      const createStructuredLyrics = () => {
        if (songStructure.length === 0) {
          return lyrics; // Return raw lyrics if no structure
        }

        // Split lyrics into lines and distribute across structure
        const lyricsLines = lyrics.split('\n').filter(line => line.trim());
        const linesPerSection = Math.ceil(lyricsLines.length / songStructure.length);

        let structuredLyrics = '';
        songStructure.forEach((section, index) => {
          const startIndex = index * linesPerSection;
          const endIndex = Math.min(startIndex + linesPerSection, lyricsLines.length);
          const sectionLines = lyricsLines.slice(startIndex, endIndex);

          if (sectionLines.length > 0) {
            structuredLyrics += `[${section}]\n${sectionLines.join('\n')}\n\n`;
          }
        });

        return structuredLyrics.trim();
      };

      const finalLyrics = createStructuredLyrics();

      // Call the music generation API
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          lyrics: finalLyrics,
          audio_setting: {
            sample_rate: sampleRate,
            bitrate: bitrate,
            format: audioFormat
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate music')
      }

      const data = await response.json()

      if (data.status === 'in_progress') {
        alert(data.message)
        return
      }

      if (data.status === 'completed') {
        // Convert base64 audio data to blob URL for playback
        const audioBlob = new Blob([Uint8Array.from(atob(data.audio_data), c => c.charCodeAt(0))], {
          type: `audio/${data.audio_format}`
        })
        const audioUrl = URL.createObjectURL(audioBlob)
        setGeneratedImages([audioUrl]) // Using same state for now, could be renamed to generatedMusic
      }
    } catch (error) {
      console.error('Music generation failed:', error)
      alert('Music generation failed. Please try again.')
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
        <Header title="Text To Music" />

        <main className="container mx-auto  lg:px-8 xl:px-12 2xl:px-16">
          <InputSection
            prompt={prompt}
            setPrompt={setPrompt}
            lyrics={lyrics}
            setLyrics={setLyrics}
            songStructure={songStructure}
            setSongStructure={setSongStructure}
            onGenerate={handleGenerate}
            onSettingsToggle={handleSettingsToggle}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            audioFormat={audioFormat}
          />
        </main>

        
      </div>
      

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        sampleRate={sampleRate}
        setSampleRate={setSampleRate}
        bitrate={bitrate}
        setBitrate={setBitrate}
        audioFormat={audioFormat}
        setAudioFormat={setAudioFormat}
        promptEnhance={promptEnhance}
        setPromptEnhance={setPromptEnhance}
      />
      
    </div>
    <Footer />
    </>
  )
}
