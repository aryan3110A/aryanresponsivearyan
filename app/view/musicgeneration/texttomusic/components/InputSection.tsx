"use client"

import React from "react"
import Image from "next/image"
import { useState, useRef } from "react"
import { ImageOverlay } from "../../UI"
import { Download, Bookmark, Heart, Sparkles } from "lucide-react"
import { HoverBorderGradient } from "../../../Core/hover-border-gradient"

interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  lyrics: string
  setLyrics: (lyrics: string) =>  void
  songStructure: string[]
  setSongStructure: (structure: string[]) => void
  onGenerate: () => void
  isGenerating: boolean
  generatedImages: string[]
  selectedModel: string
  setSelectedModel: (model: string) => void
  audioFormat: string
}

export default function InputSection({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  generatedImages,
  selectedModel,
  audioFormat,
}: InputSectionProps) {

  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)







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
    <div className="w-full flex flex-col items-center gap-8">
      {/* Desktop Layout - Input with buttons inline */}
      <div className="hidden xl:flex items-center gap-4 w-full md:max-w-4xl lg:max-w-5xl px-4">
        <div className="flex-1 relative max-w-full">
          <div className="p-2 flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-full transition-all duration-300 ease-in-out w-[1100px] max-w-full">
            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm ml-4 w-full max-w-full"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />
            <div className="flex items-center gap-2">
              <button className=" hover:bg-gray-700/50 rounded-full transition-colors border border-white/10 p-2 ">
                <Image src="/newt2image/enhancer.png" alt="enhancer" width={20} height={20} />
              </button>
              <HoverBorderGradient
                onClick={!prompt.trim() || isGenerating ? undefined : onGenerate}
                backgroundColor="bg-[#006aff]"
                className={`px-8 py-3 font-regular text-sm rounded-full ${(!prompt.trim() || isGenerating) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </HoverBorderGradient>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout - Fully Responsive */}
      <div className="xl:hidden w-full max-w-full px-0 ">
        {/* Input Field Only - Full Width Responsive */}
        <div className="w-full max-w-full mb-2">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-full p-3 xs:p-4 sm:p-5 transition-all duration-300 ease-in-out w-full max-w-full">
            <input
              type="text"
              placeholder="Type a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-base xs:text-lg sm:text-xl ml-2 mr-1 xs:ml-3 w-full max-w-full"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />

            <button className="p-3 hover:bg-gray-700/50 rounded-full transition-colors border border-white/10 md:ml-2">
              <Image
                src="/newt2image/enhancer.png"
                alt="enhancer"
                width={24}
                height={24}
                className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
              />
            </button>
          </div>
        </div>

        {/* Buttons Below Input - Responsive Sizing */}
        <div className="flex items-center gap-3 xs:gap-4 justify-end w-full max-w-full">
          <HoverBorderGradient
            onClick={!prompt.trim() || isGenerating ? undefined : onGenerate}
            backgroundColor="bg-[#006aff]"
            className="px-6 py-3 xs:py-4 rounded-full font-medium text-base xs:text-lg flex-1 max-w-[100%]"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </HoverBorderGradient>
        </div>
      </div>



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
                      <div className="w-12 h-12 bg-gradient-to-r from-[#006aff] to-[#412399] rounded-full flex items-center justify-center">
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
