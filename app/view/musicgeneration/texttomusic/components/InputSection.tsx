"use client"

import React from "react"
import Image from "next/image"
import { useState, useRef } from "react"
import { AttachmentsDropdown, UploadComponent, ImageOverlay } from "../../UI"
import { Download, Bookmark, Heart, Sparkles, Settings } from "lucide-react"
import { HoverBorderGradient } from "../../../Core/hover-border-gradient"

interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  lyrics: string
  setLyrics: (lyrics: string) => void
  songStructure: string[]
  setSongStructure: (structure: string[]) => void
  onGenerate: () => void
  onSettingsToggle: () => void
  isGenerating: boolean
  generatedImages: string[]
  selectedModel: string
  setSelectedModel: (model: string) => void
  audioFormat: string
}

export default function InputSection({
  prompt,
  setPrompt,
  lyrics,
  setLyrics,
  songStructure,
  setSongStructure,
  onGenerate,
  onSettingsToggle,
  isGenerating,
  generatedImages,
  selectedModel,
  audioFormat,
}: InputSectionProps) {
  const [showUploadComponent, setShowUploadComponent] = useState(false)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)

  // Create structured lyrics preview
  const createStructuredLyrics = () => {
    if (songStructure.length === 0 || !lyrics.trim()) {
      return lyrics;
    }

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

  const handleChooseFromLibrary = () => {
    console.log("Choose from library clicked")
  }

  const handleUploadFromDevices = () => {
    setShowUploadComponent(true)
    console.log("Upload from devices clicked")
  }

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files)
  }



  const handleAudioDownload = async (audioUrl: string, index: number) => {
    try {
      console.log(`Downloading music ${index + 1}...`)

      // For blob URLs, we can directly download them
      if (audioUrl.startsWith('blob:')) {
        const link = document.createElement("a")
        link.href = audioUrl

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
        const filename = `generated-music-${index + 1}-${timestamp}.${audioFormat}`
        link.download = filename

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        console.log(`Music ${index + 1} downloaded successfully as ${filename}`)
        return
      }

      // For regular URLs, fetch and download
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch audio")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `generated-music-${index + 1}-${timestamp}.${audioFormat}`
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log(`Music ${index + 1} downloaded successfully as ${filename}`)
    } catch (error) {
      console.error("Audio download failed:", error)
      alert("Failed to download music. Please try again.")
    }
  }

  const handleBookmark = (index: number) => {
    setBookmarkedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const handleLike = (index: number) => {
    setLikedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) {
        updated.delete(index)
      } else {
        updated.add(index)
      }
      return updated
    })
  }

  const handleInfo = (imageUrl: string, index: number) => {
    setSelectedImageForOverlay({ url: imageUrl, index })
  }

  const closeImageOverlay = () => {
    setSelectedImageForOverlay(null)
  }

  return (
    <div className="flex flex-col items-center w-full space-y-6 mb:space-y-4 lg:space-y-12">
      {/* Desktop Layout - Input with buttons inline */}
      <div className="hidden xl:flex items-center gap-4 w-full md:max-w-6xl lg:max-w-7xl px-4">
        <div className="flex-1 relative">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-2xl lg:rounded-3xl p-4 transition-all duration-300 ease-in-out">
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />

            <div className="flex-1 ml-4 space-y-8">
              {/* Music Style Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                  <h3 className="text-white text-lg font-medium">Music styles</h3>
                </div>
                <input
                  type="text"
                  placeholder="Describe your music style (e.g., upbeat pop song, catchy melody, modern production...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-[#6C3BFF] focus:bg-gray-900/70 transition-all text-base"
                  onKeyDown={(e) => e.key === "Enter" && onGenerate()}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Describe the genre, mood, and instruments</span>
                  <span className="text-xs text-gray-400">{prompt.length}/300</span>
                </div>
              </div>

              {/* Song Structure Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                  <h3 className="text-white text-lg font-medium">Song Structure</h3>
                </div>

                {/* Available Sections */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Add sections to build your song:</p>
                  <div className="flex flex-wrap gap-3">
                    {['intro', 'verse', 'chorus', 'bridge', 'outro'].map((section) => (
                      <button
                        key={section}
                        onClick={() => {
                          if (!songStructure.includes(section)) {
                            setSongStructure([...songStructure, section]);
                          }
                        }}
                        disabled={songStructure.includes(section)}
                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                          songStructure.includes(section)
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-[#6C3BFF]/20 border-2 border-[#6C3BFF] text-[#6C3BFF] hover:bg-[#6C3BFF]/30 hover:scale-105"
                        }`}
                      >
                        {songStructure.includes(section) ? "✓" : "+"} {section.charAt(0).toUpperCase() + section.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Structure */}
                {songStructure.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">Your song structure:</p>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {songStructure.map((section, index) => (
                          <div key={index} className="flex items-center gap-2 px-4 py-2 bg-[#6C3BFF] text-white rounded-lg text-sm font-medium">
                            <span>{index + 1}. {section.charAt(0).toUpperCase() + section.slice(1)}</span>
                            <button
                              onClick={() => setSongStructure(songStructure.filter((_, i) => i !== index))}
                              className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      {songStructure.length > 0 && (
                        <button
                          onClick={() => setSongStructure([])}
                          className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Lyrics Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#6C3BFF] rounded-full"></div>
                    <h3 className="text-white text-lg font-medium">Lyrics</h3>
                  </div>
                  {songStructure.length > 0 && lyrics.trim() && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-4 py-2 bg-[#6C3BFF]/20 border border-[#6C3BFF] text-[#6C3BFF] rounded-lg text-sm hover:bg-[#6C3BFF]/30 transition-colors"
                    >
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                  )}
                </div>

                <textarea
                  placeholder="Write your lyrics here... The structure you selected above will be applied automatically."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-400 outline-none focus:border-[#6C3BFF] focus:bg-gray-900/70 transition-all resize-none text-base leading-relaxed"
                  rows={6}
                  onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && onGenerate()}
                />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Write your lyrics without structure tags</span>
                  <span className="text-xs text-gray-400">{lyrics.length}/600</span>
                </div>

                {/* Preview Section */}
                {showPreview && songStructure.length > 0 && lyrics.trim() && (
                  <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-400 font-medium">Structured Preview</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                        {createStructuredLyrics()}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-400">This is how your lyrics will be sent to the AI music generator</p>
                  </div>
                )}
              </div>

              {/* Action Buttons - Desktop */}
              <div className="flex items-center justify-center gap-6 pt-8 border-t border-gray-700/50">
                <button className="flex items-center gap-3 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors border border-gray-600">
                  <Image src="/newt2image/enhancer.png" alt="enhancer" width={24} height={24} />
                  <span className="text-white text-sm font-medium">Enhance</span>
                </button>
                <HoverBorderGradient
                  onClick={!prompt.trim() || !lyrics.trim() || isGenerating ? undefined : onGenerate}
                  backgroundColor="bg-[#006aff]"
                  className="flex items-center gap-3 px-8 py-4 font-semibold text-base shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Music</span>
                    </>
                  )}
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onSettingsToggle}
          className="p-4 bg-[#1F1F1F] backdrop-blur-sm rounded-2xl hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E]"
        >
          <Settings className="h-12 w-12"/>
        </button>
      </div>

      {/* Mobile & Tablet Layout - Fully Responsive */}
      <div className="xl:hidden w-full px-0 ">
        {/* Input Field Only - Full Width Responsive */}
        <div className="w-full mb-4">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-xl sm:rounded-2xl p-2 xs:p-4 transition-all duration-300 ease-in-out">
            <AttachmentsDropdown
              onChooseFromLibrary={handleChooseFromLibrary}
              onUploadFromDevices={handleUploadFromDevices}
            />

            <div className="flex-1 ml-2 mr-1 xs:ml-3 space-y-6">
              {/* Music Style - Mobile */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6C3BFF] rounded-full"></div>
                  <h3 className="text-white text-base font-medium">Music Style</h3>
                </div>
                <input
                  type="text"
                  placeholder="Describe your music style..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#6C3BFF] text-sm"
                  onKeyDown={(e) => e.key === "Enter" && onGenerate()}
                />
                <div className="text-xs text-gray-400 text-right">{prompt.length}/300</div>
              </div>

              {/* Song Structure - Mobile */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6C3BFF] rounded-full"></div>
                  <h3 className="text-white text-base font-medium">Structure</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['intro', 'verse', 'chorus', 'bridge', 'outro'].slice(0, 3).map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        if (!songStructure.includes(section)) {
                          setSongStructure([...songStructure, section]);
                        }
                      }}
                      disabled={songStructure.includes(section)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        songStructure.includes(section)
                          ? "bg-gray-700 text-gray-500"
                          : "bg-[#6C3BFF]/20 border border-[#6C3BFF] text-[#6C3BFF]"
                      }`}
                    >
                      {songStructure.includes(section) ? "✓" : "+"} {section}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['intro', 'verse', 'chorus', 'bridge', 'outro'].slice(3).map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        if (!songStructure.includes(section)) {
                          setSongStructure([...songStructure, section]);
                        }
                      }}
                      disabled={songStructure.includes(section)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        songStructure.includes(section)
                          ? "bg-gray-700 text-gray-500"
                          : "bg-[#6C3BFF]/20 border border-[#6C3BFF] text-[#6C3BFF]"
                      }`}
                    >
                      {songStructure.includes(section) ? "✓" : "+"} {section}
                    </button>
                  ))}
                </div>

                {songStructure.length > 0 && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                    <div className="flex flex-wrap gap-1">
                      {songStructure.map((section, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-[#6C3BFF] text-white rounded text-xs">
                          <span>{index + 1}. {section}</span>
                          <button
                            onClick={() => setSongStructure(songStructure.filter((_, i) => i !== index))}
                            className="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lyrics - Mobile */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#6C3BFF] rounded-full"></div>
                  <h3 className="text-white text-base font-medium">Lyrics</h3>
                </div>
                <textarea
                  placeholder="Write your lyrics here..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#6C3BFF] text-sm resize-none"
                  rows={4}
                  onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && onGenerate()}
                />
                <div className="text-xs text-gray-400 text-right">{lyrics.length}/600</div>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-700/50 mt-6">
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-600">
                  <Image src="/newt2image/enhancer.png" alt="enhancer" width={20} height={20} />
                  <span className="text-white text-sm font-medium">Enhance</span>
                </button>
                <HoverBorderGradient
                  onClick={!prompt.trim() || !lyrics.trim() || isGenerating ? undefined : onGenerate}
                  backgroundColor="bg-[#006aff]"
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-sm shadow-lg flex-1"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Music</span>
                    </>
                  )}
                </HoverBorderGradient>
                <button
                  onClick={onSettingsToggle}
                  className="p-3 bg-[#1F1F1F] backdrop-blur-sm rounded-lg hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E]"
                >
                  <Image
                    src="/mockupgeneration/setting.png"
                    alt="Settings"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>

      {/* Upload Component Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">Upload Files</h3>
              <button
                onClick={() => setShowUploadComponent(false)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <UploadComponent onFilesSelected={handleFilesSelected} />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-8 xs:py-12 lg:py-16">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-12 xs:w-12 lg:h-16 lg:w-16 border-b-2 border-white"></div>
        </div>
      )}

      {/* Generated Images - Fully Responsive Layout */}
      {generatedImages && generatedImages.length > 0 && (
        <div className="w-full">
          {/* Desktop Layout - Grid */}
          <div className="hidden xl:block max-w-8xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4 px-6">
              <div className="bg-white/10 rounded-lg p-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-white text-sm font-medium">{prompt}</span>
            </div>

            <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 lg:p-8 min-h-[400px] overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-6">
                {generatedImages.map((audioUrl, index) => (
                  <div
                    key={index}
                    className="w-full max-w-md bg-gray-900/50 rounded-xl p-6 group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Generated Music {index + 1}</h3>
                        <p className="text-gray-400 text-sm">Format: {audioFormat.toUpperCase()}</p>
                      </div>
                    </div>

                    <audio
                      controls
                      className="w-full mb-4"
                      style={{
                        filter: 'invert(1) hue-rotate(180deg)',
                        borderRadius: '8px'
                      }}
                    >
                      <source src={audioUrl} type={`audio/${audioFormat}`} />
                      Your browser does not support the audio element.
                    </audio>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleLike(index)}
                        className={`p-2 rounded-full transition-colors ${
                          likedImages.has(index) ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedImages.has(index) ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleBookmark(index)}
                        className={`p-2 rounded-full transition-colors ${
                          bookmarkedImages.has(index) ? "bg-blue-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${bookmarkedImages.has(index) ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleAudioDownload(audioUrl, index)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Layout - Fully Responsive Horizontal Scrolling */}
          <div className="xl:hidden w-full">
            {/* Prompt Display - Responsive Width */}
            <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4 px-3 xs:px-4 sm:px-6">
              <div className="bg-white/10 rounded-lg p-1.5 xs:p-2 flex-shrink-0">
                <Sparkles className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400" />
              </div>
              <span className="text-white text-xs xs:text-sm font-medium line-clamp-2 flex-1">{prompt}</span>
            </div>

            {/* Horizontal Scrolling Images Container - Fully Responsive */}
            <div className="relative w-full">
              <div
                ref={scrollContainerRef}
                className="flex gap-3 xs:gap-4 overflow-x-auto scrollbar-hide px-3 xs:px-4 sm:px-6 pb-4"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[calc(100vw-6rem)] xs:w-[calc(100vw-8rem)] sm:w-[calc(100vw-12rem)] md:w-[calc(50vw-4rem)] max-w-sm"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Image Container - Responsive */}
                    <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 xs:p-4 overflow-hidden w-full">
                      <div className="relative w-full aspect-square bg-gray-900/50 rounded-xl overflow-hidden">
                        <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Generated image ${index + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Mobile Action Buttons - Responsive Sizing */}
                        <div className="absolute inset-0 bg-black/5">
                          {/* Info Button - Top Right */}
                          <button
                            onClick={() => handleInfo(image, index)}
                            className="text-black font-semibold absolute top-2 xs:top-3 right-2 xs:right-3 w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-xs xs:text-sm"
                          >
                            !
                          </button>

                          {/* Action Buttons - Bottom Left */}
                          <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 flex items-center gap-1.5 xs:gap-2">
                            <button
                              onClick={() => handleAudioDownload(image, index)}
                              className="p-1.5 xs:p-2 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200"
                            >
                              <Download className="w-3 h-3 xs:w-4 xs:h-4 text-[#000]" />
                            </button>

                            <button onClick={() => handleBookmark(index)}>
                              <Bookmark
                                className={`w-4 h-4 xs:w-5 xs:h-5 transition-colors duration-200 ${
                                  bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                                }`}
                              />
                            </button>

                            <button onClick={() => handleLike(index)}>
                              <Heart
                                className={`w-4 h-4 xs:w-5 xs:h-5 transition-colors duration-200 ${
                                  likedImages.has(index) ? "fill-red-500 text-red-500" : "text-[#fff]"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Indicators - Responsive */}
              {generatedImages.length > 1 && (
                <div className="flex justify-center mt-3 xs:mt-4 gap-1.5 xs:gap-2">
                  {generatedImages.map((_, index) => (
                    <div key={index} className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-gray-600" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Overlay Modal */}
      {selectedImageForOverlay && (
        <ImageOverlay
          isOpen={!!selectedImageForOverlay}
          onClose={closeImageOverlay}
          imageUrl={selectedImageForOverlay.url}
          prompt={prompt}
          stickerType={selectedModel}
          numberOfItems={1}
          itemLabel="Music"
        />
      )}

      {/* Add scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
