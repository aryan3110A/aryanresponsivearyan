"use client"

import React, { useState } from "react"
import { Header } from "../UI"
import InputSection from "./components/InputSection"
import SettingsPanel from "./components/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"

import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"

export default function TextToMusic() {
  const [prompt, setPrompt] = useState("")
  const [generatedMusic, setGeneratedMusic] = useState<string[]>([])

  const [isGenerating, setIsGenerating] = useState(false)

  // Music generation specific states
  const [selectedModel, setSelectedModel] = useState<string>("music-1.5")
  const [sampleRate, setSampleRate] = useState<number>(44100)
  const [bitrate, setBitrate] = useState<number>(256000)
  const [audioFormat, setAudioFormat] = useState<string>("mp3")
  const [outputFormat, setOutputFormat] = useState<string>("hex")
  const [lyrics, setLyrics] = useState<string>("")
  const [songStructure, setSongStructure] = useState<string[]>(["verse", "chorus", "verse", "chorus", "bridge", "chorus"])
  // const [generationStatus, setGenerationStatus] = useState<string>("")

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please provide a prompt")
      return
    }
    if (prompt.length < 10 || prompt.length > 600) {
      alert("Prompt must be between 10 and 600 characters")
      return
    }
    setIsGenerating(true)
    setGeneratedMusic([])
    
    try {
      // Create structured lyrics by combining user prompt with song structure
      const createStructuredLyrics = () => {
        if (songStructure.length === 0) return prompt
        const promptLines = prompt.split('\n').filter(line => line.trim())
        const linesPerSection = Math.ceil(promptLines.length / songStructure.length)
        let structuredLyrics = ''
        songStructure.forEach((section, index) => {
          const startIndex = index * linesPerSection
          const endIndex = Math.min(startIndex + linesPerSection, promptLines.length)
          const sectionLines = promptLines.slice(startIndex, endIndex)
          if (sectionLines.length > 0) {
            structuredLyrics += `[${section}]\n${sectionLines.join('\n')}\n\n`
          }
        })
        return structuredLyrics.trim()
      }
      const finalLyrics = createStructuredLyrics()
      
      // Call the music generation API
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: "Generate music based on the provided lyrics",
          lyrics: finalLyrics,
          audio_setting: {
            sample_rate: sampleRate,
            bitrate: bitrate,
            format: audioFormat
          },
          output_format: outputFormat
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      // Handle the synchronous response
      if (data.status === 'completed' && data.audio_data) {
        console.log('Music generation completed successfully')
        
        try {
          // Convert hex to blob URL for playback
          const hexString = data.audio_data
          const bytes = new Uint8Array(hexString.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || [])
          
          // Create blob with proper MIME type based on the audio format
          const mimeType = data.audio_format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
          const audioBlob = new Blob([bytes], {
            type: mimeType
          })
          const audioUrl = URL.createObjectURL(audioBlob)
          setGeneratedMusic([audioUrl])
          console.log('Audio blob created successfully:', audioBlob.size, 'bytes')
          
          // Test if the audio can be loaded
          const audio = new Audio(audioUrl)
          audio.addEventListener('canplay', () => {
            console.log('Audio can play successfully')
          })
          audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e)
          })
          
        } catch (blobError) {
          console.error('Blob creation failed:', blobError)
          throw new Error('Failed to create audio blob')
        }
      } else {
        throw new Error('Music generation failed or returned invalid data')
      }
    } catch (error) {
      console.error('Music generation failed:', error)
      alert(`Music generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StableBackground />
        <NavigationFull />
        <div className="flex w-full h-screen scrollbar-hide" style={{ marginTop: '64px' }}>
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <SettingsPanel
            onClose={() => {}} // No-op since we want it always open
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            sampleRate={sampleRate}
            setSampleRate={setSampleRate}
            bitrate={bitrate}
            setBitrate={setBitrate}
            audioFormat={audioFormat}
            setAudioFormat={setAudioFormat}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            lyrics={lyrics}
            songStructure={songStructure}
            setSongStructure={setSongStructure}
            className="w-[480px] max-h-[calc(100vh-128px)] overflow-y-auto sticky z-30 border-r border-[#222] scrollbar-hide"
          />
          <div className="flex-1 h-full overflow-y-auto flex justify-center scrollbar-hide">
            <div className="w-full max-w-5xl flex flex-col items-center justify-center px-2 sm:px-4 gap-6 mx-auto">
              <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm py-4 w-full">
                <Header title="Text To Music" />
              </div>
              <div className="w-full flex flex-col items-center gap-6 min-h-[400px]">
                <InputSection
                  prompt={prompt}
                  setPrompt={setPrompt}
                  lyrics={lyrics}
                  setLyrics={setLyrics}
                  songStructure={songStructure}
                  setSongStructure={setSongStructure}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  generatedImages={generatedMusic}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  audioFormat={audioFormat}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
