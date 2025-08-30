"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { ImageOverlay } from "../../UI"
import { Download, Bookmark, Heart, Sparkles, Upload, X } from "lucide-react"
import { HoverBorderGradient } from "../../../Core/hover-border-gradient"

export interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  uploadedImage: File | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onGenerate: () => void
  isGenerating: boolean
  generatedImages: string[]
  upscaleFactor: number
  numberOfImages: number
  quality: string
  onOverlayOpen?: () => void
  onOverlayClose?: () => void
}

export default function InputSection({
  prompt,
  setPrompt,
  uploadedImage,
  onImageUpload,
  onRemoveImage,
  onGenerate,
  isGenerating,
  generatedImages,
  upscaleFactor,
  numberOfImages,
  quality,
  onOverlayOpen,
  onOverlayClose,
}: InputSectionProps) {

  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error("Failed to fetch image")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `upscaled-image-${index + 1}-${timestamp}.png`
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      alert("Failed to download image. Please try again.")
    }
  }

  const handleBookmark = (index: number) => {
    setBookmarkedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) updated.delete(index)
      else updated.add(index)
      return updated
    })
  }

  const handleLike = (index: number) => {
    setLikedImages((prev) => {
      const updated = new Set(prev)
      if (updated.has(index)) updated.delete(index)
      else updated.add(index)
      return updated
    })
  }

  const handleInfo = (imageUrl: string, index: number) => {
    setSelectedImageForOverlay({ url: imageUrl, index })
    onOverlayOpen?.()
  }

  const closeImageOverlay = () => {
    setSelectedImageForOverlay(null)
    onOverlayClose?.()
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const removeUploadedImage = () => {
    onRemoveImage()
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 min-h-[300px]">
      {/* Image Upload Section */}
      <div className="w-full max-w-4xl">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="text-center mb-4">
            <h3 className="text-white text-lg font-medium mb-2">Upload Image to Upscale</h3>
            <p className="text-gray-400 text-sm">Upload an image and optionally add a description to enhance the upscaling</p>
          </div>
          
          {/* Image Upload Area */}
          <div className="mb-6">
            {!uploadedImage ? (
              <div 
                onClick={handleImageClick}
                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-white/40 transition-colors"
              >
                <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">Click to upload image</p>
                <p className="text-gray-400 text-sm">Supports JPG, PNG, WebP (Max 10MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="relative bg-gray-900/50 rounded-xl overflow-hidden">
                  <Image
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded image"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain max-h-96"
                  />
                  <button
                    onClick={removeUploadedImage}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-white text-sm">
                    <span className="text-gray-400">File:</span> {uploadedImage.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Size: {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Optional Prompt Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Optional Description (Enhances upscaling quality)
            </label>
            <input
              type="text"
              placeholder="Describe what you want to enhance or improve in the image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <HoverBorderGradient
              onClick={!uploadedImage || isGenerating ? undefined : onGenerate}
              backgroundColor="bg-[#006aff]"
              className={`px-8 py-3 font-medium text-white rounded-full text-lg ${
                !uploadedImage || isGenerating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              {isGenerating ? "Upscaling..." : `Upscale ${upscaleFactor}x`}
            </HoverBorderGradient>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-8 xs:py-12 lg:py-16">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-12 xs:w-12 lg:h-16 lg:w-16 border-b-2 border-white mb-4"></div>
          <div className="text-white text-center">
            <div className="text-lg font-medium">Upscaling your image...</div>
            <div className="text-gray-400 text-sm mt-1">
              {upscaleFactor}x • {quality} • {numberOfImages} image{numberOfImages > 1 ? 's' : ''}
            </div>
          </div>
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
              <span className="text-white text-sm font-medium">
                {prompt ? `Upscaled: ${prompt}` : `Upscaled ${upscaleFactor}x`}
              </span>
            </div>
            <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 lg:p-8 min-h-[400px] overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {generatedImages.map((image: string, index: number) => (
                  <div
                    onClick={() => handleInfo(image, index)}
                    key={index}
                    className="relative bg-gray-900/50 rounded-xl overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <div className="w-full bg-transparent rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Upscaled image ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div
                      className={`absolute inset-0 bg-black/10 transition-all duration-300 ${
                        hoveredImageIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <button
                        onClick={() => handleInfo(image, index)}
                        className="text-black font-semibold absolute top-3 right-3 px-[.5vw] bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                      >
                        !
                      </button>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(image, index)}
                          className="p-2 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-lg hover:bg-[#5AD7FF]/30 transition-all duration-200 group/btn"
                        >
                          <Download className="w-4 h-4 text-[#000] group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button onClick={() => handleBookmark(index)}>
                          <Bookmark
                            className={`w-6 h-6 transition-colors duration-200 ${
                              bookmarkedImages.has(index) ? "fill-[#a4c48c] text-[#a4c48c]" : "text-[#fff]"
                            }`}
                          />
                        </button>
                        <button onClick={() => handleLike(index)}>
                          <Heart
                            className={`w-6 h-6 transition-colors duration-200 ${
                              likedImages.has(index) ? "fill-red-500 text-red-500" : "text-[#fff]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Layout - Fully Responsive Horizontal Scrolling */}
          <div className="xl:hidden w-full">
            <div className="flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4 px-3 xs:px-4 sm:px-6">
              <div className="bg-white/10 rounded-lg p-1.5 xs:p-2 flex-shrink-0">
                <Sparkles className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400" />
              </div>
              <span className="text-white text-xs xs:text-sm font-medium line-clamp-2 flex-1">
                {prompt ? `Upscaled: ${prompt}` : `Upscaled ${upscaleFactor}x`}
              </span>
            </div>
            <div className="relative w-full">
              <div
                ref={scrollContainerRef}
                className="flex gap-3 xs:gap-4 overflow-x-auto scrollbar-hide px-3 xs:px-4 sm:px-6 pb-4"
                style={{
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {generatedImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[calc(100vw-6rem)] xs:w-[calc(100vw-8rem)] sm:w-[calc(100vw-12rem)] md:w-[calc(50vw-4rem)] max-w-sm"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 xs:p-4 overflow-hidden w-full">
                      <div className="relative w-full bg-gray-900/50 rounded-xl overflow-hidden">
                        <div className="w-full bg-transparent rounded-lg overflow-hidden border border-white/10">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Upscaled image ${index + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/5">
                          <button
                            onClick={() => handleInfo(image, index)}
                            className="text-black font-semibold absolute top-2 xs:top-3 right-2 xs:right-3 w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-b from-[#00F0FF] to-[#009099] backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 flex items-center justify-center text-xs xs:text-sm"
                          >
                            !
                          </button>
                          <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 flex items-center gap-1.5 xs:gap-2">
                            <button
                              onClick={() => handleDownload(image, index)}
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
              {generatedImages.length > 1 && (
                <div className="flex justify-center mt-3 xs:mt-4 gap-1.5 xs:gap-2">
                  {generatedImages.map((_: string, index: number) => (
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
          prompt={prompt || `Upscaled ${upscaleFactor}x`}
          modelSelection="Image Upscaler"
          stylePalette="Upscaled"
          imageQuality={quality}
          frameSize={`${upscaleFactor}x`}
          numberOfItems={numberOfImages}
          itemLabel="Images"
        />
      )}

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
