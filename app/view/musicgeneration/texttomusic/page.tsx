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
  const [generationStatus, setGenerationStatus] = useState<string>("")

  const handleGenerate = async () => {
    // Add default values if fields are empty
    const finalPrompt = prompt.trim() || "Create a beautiful instrumental music piece"
    const finalLyrics = lyrics.trim() || "This is a beautiful song with meaningful lyrics that tell a story of hope and inspiration"
    
    if (finalPrompt.length < 10) {
      alert("Please provide a prompt with at least 10 characters")
      return
    }

    if (finalLyrics.length < 10) {
      alert("Please provide lyrics with at least 10 characters")
      return
    }

    setIsGenerating(true)
    setGenerationStatus("Starting music generation...")

    try {
      // Create structured lyrics by combining user lyrics with song structure
      const createStructuredLyrics = () => {
        if (songStructure.length === 0) {
          return finalLyrics; // Return raw lyrics if no structure
        }

        // Split lyrics into lines and distribute across structure
        const lyricsLines = finalLyrics.split('\n').filter(line => line.trim());
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

      const finalStructuredLyrics = createStructuredLyrics();

      console.log('Sending request to API:', {
        model: selectedModel,
        prompt: finalPrompt,
        promptLength: finalPrompt.length,
        lyrics: finalStructuredLyrics,
        lyricsLength: finalStructuredLyrics.length,
        audio_setting: {
          sample_rate: sampleRate,
          bitrate: bitrate,
          format: audioFormat
        }
      })

      // Call the music generation API
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: finalPrompt,
          lyrics: finalStructuredLyrics,
          audio_setting: {
            sample_rate: sampleRate,
            bitrate: bitrate,
            format: audioFormat
          }
        }),
      })

      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error response:', errorText)
        throw new Error(`Failed to generate music: ${errorText}`)
      }

      const data = await response.json()

      if (data.status === 'in_progress') {
        // Start polling for results
        await pollForResults(data.trace_id)
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
      setGenerationStatus('')
      alert('Music generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Add polling function for long-running requests
  const pollForResults = async (traceId: string) => {
    const maxAttempts = 30 // 5 minutes with 10-second intervals
    let attempts = 0
    
    const poll = async (): Promise<void> => {
      attempts++
      setGenerationStatus(`Checking progress... (${attempts}/${maxAttempts})`)
      
      try {
        const response = await fetch(`/api/generate-music?trace_id=${traceId}`)
        
        if (!response.ok) {
          throw new Error(`Polling failed: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.status === 'completed') {
          setGenerationStatus('Processing audio...')
          // Convert base64 audio data to blob URL for playback
          const audioBlob = new Blob([Uint8Array.from(atob(data.audio_data), c => c.charCodeAt(0))], {
            type: `audio/${data.audio_format}`
          })
          const audioUrl = URL.createObjectURL(audioBlob)
          setGeneratedImages([audioUrl])
          setGenerationStatus('Music generated successfully!')
          setTimeout(() => setGenerationStatus(''), 3000) // Clear status after 3 seconds
          setIsGenerating(false)
          return
        }
        
        if (data.status === 'failed') {
          throw new Error(data.error || 'Music generation failed')
        }
        
        if (attempts >= maxAttempts) {
          throw new Error('Music generation timed out. Please try again.')
        }
        
        // Wait 10 seconds before next poll
        setTimeout(poll, 10000)
        
      } catch (error) {
        console.error('Polling error:', error)
        setGenerationStatus('')
        setIsGenerating(false)
        alert('Music generation failed. Please try again.')
      }
    }
    
    poll()
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
          {generationStatus && (
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-300 text-sm">{generationStatus}</span>
              </div>
            </div>
          )}
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
