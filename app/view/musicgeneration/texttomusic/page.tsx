"use client"

import { useState } from "react"
import { Header } from "../UI"
import SettingsPanel from "./components/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"

export default function TextToMusic() {
  const [generatedMusic, setGeneratedMusic] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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
    if (!lyrics.trim()) {
      alert("Please provide lyrics")
      return
    }
    if (lyrics.length < 10 || lyrics.length > 600) {
      alert("Lyrics must be between 10 and 600 characters")
      return
    }
    setIsGenerating(true)
    setGeneratedMusic([])
    
    try {
      // Create structured lyrics by combining user lyrics with song structure
      const createStructuredLyrics = () => {
        if (songStructure.length === 0) return lyrics
        const lyricsLines = lyrics.split('\n').filter(line => line.trim())
        const linesPerSection = Math.ceil(lyricsLines.length / songStructure.length)
        let structuredLyrics = ''
        songStructure.forEach((section, index) => {
          const startIndex = index * linesPerSection
          const endIndex = Math.min(startIndex + linesPerSection, lyricsLines.length)
          const sectionLines = lyricsLines.slice(startIndex, endIndex)
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
          audio.addEventListener('canplaythrough', () => {
            console.log('Audio loaded successfully and can play')
          })
          audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e)
          })
        } catch (conversionError) {
          console.error('Error converting audio data:', conversionError)
          throw new Error('Failed to convert audio data')
        }
      } else {
        throw new Error(data.error || 'Music generation failed')
      }
    } catch (error: any) {
      console.error('Music generation failed:', error)
      alert(error.message || 'Music generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSettingsToggle = () => setIsSettingsOpen(!isSettingsOpen)

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
        <main className="container mx-auto lg:px-8 xl:px-12 2xl:px-16">
          {/* Centered Input Box with Generate and Settings Buttons */}
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="flex items-center w-full max-w-4xl bg-gray-800 rounded-xl p-2 border border-gray-600">
              {/* Add Button */}
              <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 transition-colors mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {/* Input Field */}
              <input
                type="text"
                placeholder="Type a lyrics..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg px-4"
              />
              {/* Sparkle Button */}
              <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 transition-colors mr-3">
                <div className="relative">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <svg className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </button>
              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-3"
              >
                {isGenerating ? "Generating Music..." : "Generate"}
              </button>

              {/* Settings Button */}
              <button
                onClick={handleSettingsToggle}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Generated Music Display */}
          {generatedMusic.length > 0 && (
            <div className="flex items-center justify-center mt-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Generated Music</h3>
                    <p className="text-gray-400 text-sm">Format: {audioFormat.toUpperCase()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <audio
                    controls
                    className="w-full"
                    style={{
                      filter: 'invert(1) hue-rotate(180deg)',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      console.error('Audio playback error:', e)
                      const target = e.target as HTMLAudioElement
                      console.error('Audio error details:', {
                        error: target.error,
                        networkState: target.networkState,
                        readyState: target.readyState
                      })
                    }}
                    onLoadStart={() => console.log('Audio loading started')}
                    onCanPlay={() => console.log('Audio can play')}
                    onLoadedData={() => console.log('Audio data loaded')}
                    onCanPlayThrough={() => console.log('Audio can play through')}
                  >
                    <source src={generatedMusic[0]} type={`audio/${audioFormat}`} />
                    Your browser does not support the audio element.
                  </audio>
                  
                  {/* Fallback play button */}
                  <button
                    onClick={() => {
                      const audio = new Audio(generatedMusic[0])
                      audio.play().catch(error => {
                        console.error('Fallback audio play failed:', error)
                        alert('Audio playback failed. Please try downloading the file.')
                      })
                    }}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Play Audio (Fallback)
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={async () => {
                      try {
                        // Fetch the blob from the blob URL
                        const response = await fetch(generatedMusic[0])
                        const blob = await response.blob()
                        
                        // Create download link
                        const link = document.createElement("a")
                        link.href = URL.createObjectURL(blob)
                        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
                        const filename = `generated-music-${timestamp}.${audioFormat}`
                        link.download = filename
                        
                        // Trigger download
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        
                        // Clean up the temporary URL
                        URL.revokeObjectURL(link.href)
                        
                        console.log('Download started:', filename)
                      } catch (error) {
                        console.error('Download failed:', error)
                        alert('Download failed. Please try again.')
                      }
                    }}
                    className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    title="Download Music"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
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
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        lyrics={lyrics}
        songStructure={songStructure}
        setSongStructure={setSongStructure}
      />
    </div>
    <Footer />
    </>
  )
}
