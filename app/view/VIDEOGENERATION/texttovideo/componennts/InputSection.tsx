"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { AttachmentsDropdown, UploadComponent, ImageOverlay } from "../../UI"
import { Download, Bookmark, Heart, Sparkles } from "lucide-react"
import { getModelType } from "./videoModels"

interface InputSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerate: () => void
  onSettingsToggle: () => void
  isGenerating: boolean
  generatedImages: string[]
  selectedModel: string
  selectedStyle: string | null
  selectedQuality: string
  selectedAspectRatio: string
  numberOfImages: number
  firstFrameImage: string | null
  setFirstFrameImage: (image: string | null) => void
  subjectImage: string | null
  setSubjectImage: (image: string | null) => void
}

export default function InputSection({
  prompt,
  setPrompt,
  onGenerate,
  onSettingsToggle,
  isGenerating,
  generatedImages,
  selectedModel,
  selectedStyle,
  selectedQuality,
  selectedAspectRatio,
  numberOfImages,
  firstFrameImage,
  setFirstFrameImage,
  subjectImage,
  setSubjectImage,
}: InputSectionProps) {
  const [showUploadComponent, setShowUploadComponent] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [bookmarkedImages, setBookmarkedImages] = useState<Set<number>>(new Set())
  const [selectedImageForOverlay, setSelectedImageForOverlay] = useState<{
    url: string
    index: number
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to check if the content is a video
  const isVideo = (url: string) => {
    if (!url) return false
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
    const lowerUrl = url.toLowerCase()
    return videoExtensions.some(ext => lowerUrl.includes(ext)) ||
           lowerUrl.includes('video') ||
           lowerUrl.includes('/static/videos/') ||
           lowerUrl.includes('minimax') // MiniMax video URLs
  }

  const handleChooseFromLibrary = () => {
    console.log("Choose from library clicked")
  }



  const handleUploadFromDevices = () => {
    setShowUploadComponent(true)
    console.log("Upload from devices clicked")
  }

  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files)

    if (files.length > 0) {
      const file = files[0]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB')
        return
      }

      // Start upload process
      setIsUploading(true)
      setUploadProgress(0)
      setShowUploadComponent(false)

      const reader = new FileReader()

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      reader.onload = (e) => {
        // Complete the progress
        setUploadProgress(100)

        setTimeout(() => {
          const imageData = e.target?.result as string
          const modelType = getModelType(selectedModel)

          // Set the appropriate image based on model type
          console.log('=== IMAGE UPLOAD DEBUG ===')
          console.log('Selected Model:', selectedModel)
          console.log('Model Type:', modelType)
          console.log('Image Data Length:', imageData.length)
          console.log('========================')

          if (modelType === 'image-to-video') {
            console.log('✅ Setting firstFrameImage for image-to-video model')
            setFirstFrameImage(imageData)
          } else if (modelType === 'subject-reference') {
            console.log('✅ Setting subjectImage for subject-reference model (S2V-01)')
            setSubjectImage(imageData)
          } else {
            // For text-to-video models that support optional first frame (like MiniMax Hailuo 02)
            console.log('✅ Setting firstFrameImage for text-to-video model')
            setFirstFrameImage(imageData)
          }

          // Reset upload state
          setIsUploading(false)
          setUploadProgress(0)
        }, 500) // Small delay to show 100% completion
      }

      reader.onerror = () => {
        clearInterval(progressInterval)
        setIsUploading(false)
        setUploadProgress(0)
        alert('Error reading file. Please try again.')
      }

      reader.readAsDataURL(file)
    }
  }

  const handleDownload = async (mediaUrl: string, index: number) => {
    try {
      const isVideoFile = isVideo(mediaUrl)
      console.log(`Downloading ${isVideoFile ? 'video' : 'image'} ${index + 1}...`)

      const response = await fetch(mediaUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${isVideoFile ? 'video' : 'image'}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const extension = isVideoFile ? 'mp4' : 'png'
      const filename = `generated-${isVideoFile ? 'video' : 'image'}-${index + 1}-${timestamp}.${extension}`
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log(`${isVideoFile ? 'Video' : 'Image'} ${index + 1} downloaded successfully as ${filename}`)
    } catch (error) {
      console.error("Download failed:", error)
      alert(`Failed to download ${isVideo(mediaUrl) ? 'video' : 'image'}. Please try again.`)
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
            <div className="relative">
              <AttachmentsDropdown
                onChooseFromLibrary={handleChooseFromLibrary}
                onUploadFromDevices={handleUploadFromDevices}
              />
              {(firstFrameImage || subjectImage) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              )}
            </div>

            <input
              type="text"
              placeholder={`Describe your ${getModelType(selectedModel).replace('-', ' to ')} generation...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-lg ml-4"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors border border-white/10">
                <Image src="/newt2image/enhancer.png" alt="enhancer" width={28} height={28} />
              </button>
              <button
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-12 py-3 rounded-2xl font-medium text-base"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onSettingsToggle}
          className="p-3 bg-[#1F1F1F] backdrop-blur-sm rounded-2xl hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E]"
        >
          <Image src="/mockupgeneration/setting.png" alt="Settings" width={32} height={32} className="w-12 h-12" />
        </button>
      </div>

      {/* Mobile & Tablet Layout - Fully Responsive */}
      <div className="xl:hidden w-full px-0 ">
        {/* Input Field Only - Full Width Responsive */}
        <div className="w-full mb-4">
          <div className="flex items-center bg-[#ffffff]/5 hover:bg-[#ffffff]/20 backdrop-blur-sm border border-[#8E8E8E] rounded-xl sm:rounded-2xl p-2 xs:p-4 transition-all duration-300 ease-in-out">
            <div className="relative">
              <AttachmentsDropdown
                onChooseFromLibrary={handleChooseFromLibrary}
                onUploadFromDevices={handleUploadFromDevices}
              />
              {(firstFrameImage || subjectImage) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              )}
            </div>

            <input
              type="text"
              placeholder={`Describe your ${getModelType(selectedModel).replace('-', ' to ')} generation...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white outline-none text-sm xs:text-base sm:text-lg ml-2 mr-1 xs:ml-3"
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
            />

            <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors border border-white/10 md:ml-2">
              <Image
                src="/newt2image/enhancer.png"
                alt="enhancer"
                width={20}
                height={20}
                className="w-5 h-5 "
              />
            </button>
          </div>
        </div>

        {/* Buttons Below Input - Responsive Sizing */}
        <div className="flex items-center gap-3 xs:gap-4 justify-end w-full">
          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors text-white px-2  py-2.5 xs:py-3 rounded-lg xs:rounded-xl font-medium text-sm xs:text-base flex-1 max-w-[32%] "
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>

          <button
            onClick={onSettingsToggle}
            className="p-2  bg-[#1F1F1F] backdrop-blur-sm rounded-lg xs:rounded-xl hover:bg-gradient-to-b from-[#6C3BFF] to-[#412399] transition-colors border border-[#8E8E8E] flex-shrink-0"
          >
            <Image
              src="/mockupgeneration/setting.png"
              alt="Settings"
              width={24}
              height={24}
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7"
            />
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
              <span className="text-white text-sm font-medium">Uploading image...</span>
              <span className="text-gray-400 text-sm">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {(firstFrameImage || subjectImage) && !isUploading && (
        <div className="w-full max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">Uploaded Images</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {firstFrameImage && (
                <div className="relative">
                  <div className="relative w-full h-24 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={firstFrameImage}
                      alt="First frame image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-green-400 text-xs font-medium">
                      {getModelType(selectedModel) === 'image-to-video' ? 'First Frame Image' :
                       getModelType(selectedModel) === 'subject-reference' ? 'Subject Reference' : 'Reference Image'}
                    </span>
                  </div>
                  <button
                    onClick={() => setFirstFrameImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {subjectImage && (
                <div className="relative">
                  <div className="relative w-full h-24 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={subjectImage}
                      alt="Subject reference image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-green-400 text-xs font-medium">Subject Reference</span>
                  </div>
                  <button
                    onClick={() => setSubjectImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <span className="text-gray-400 text-xs">
                Model: {selectedModel} • Type: {getModelType(selectedModel).replace('-', ' to ')}
                {getModelType(selectedModel) === 'subject-reference' && ' • Upload subject reference image'}
                {getModelType(selectedModel) === 'image-to-video' && ' • Upload first frame image'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Component Modal */}
      {showUploadComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-lg">
                Upload Image for {getModelType(selectedModel).replace('-', ' to ')} Model
              </h3>
              <button
                onClick={() => setShowUploadComponent(false)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                {getModelType(selectedModel) === 'image-to-video' &&
                  "Upload an image that will be used as the starting frame for your video."
                }
                {getModelType(selectedModel) === 'subject-reference' &&
                  "Upload an image of the subject you want to appear in the video."
                }
                {getModelType(selectedModel) === 'text-to-video' &&
                  "Upload an optional reference image to guide the video generation."
                }
              </p>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {generatedImages.map((image, index) => {
                  const videoCheck = isVideo(image)
                  console.log(`🎬 Rendering media ${index}:`, {
                    url: image,
                    isVideo: videoCheck,
                    hasStaticVideos: image?.includes('/static/videos/'),
                    hasMp4: image?.includes('.mp4')
                  })

                  return (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-900/50 rounded-xl overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setHoveredImageIndex(index)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                  >
                    <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10 relative">
                      {videoCheck ? (
                        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
                          <video
                            src={image}
                            className="w-full h-full object-contain"
                            controls
                            preload="auto"
                            playsInline
                            webkit-playsinline="true"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error('Video error:', e)
                              console.error('Failed video URL:', image)
                            }}
                            onLoadStart={() => console.log('✅ Video loading started:', image)}
                            onLoadedData={() => console.log('✅ Video loaded successfully:', image)}
                            onCanPlay={() => console.log('✅ Video can play:', image)}
                            onPlay={() => console.log('▶️ Video started playing:', image)}
                            onPause={() => console.log('⏸️ Video paused:', image)}
                            onClick={(e) => {
                              const video = e.target as HTMLVideoElement
                              if (video.paused) {
                                video.play().catch(err => console.error('Play failed:', err))
                              } else {
                                video.pause()
                              }
                            }}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              backgroundColor: 'black',
                              cursor: 'pointer'
                            }}
                          >
                            <source src={image} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Generated image ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-contain"
                          onError={(e) => console.error('Image error:', e)}
                          unoptimized={image?.includes('/static/videos/')} // Don't optimize video files
                        />
                      )}
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
                  )
                })}
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
                {generatedImages.map((image, index) => {
                  const videoCheck = isVideo(image)
                  console.log(`📱 Mobile media ${index}:`, {
                    url: image,
                    isVideo: videoCheck,
                    hasStaticVideos: image?.includes('/static/videos/'),
                    hasMp4: image?.includes('.mp4')
                  })

                  return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[calc(100vw-6rem)] xs:w-[calc(100vw-8rem)] sm:w-[calc(100vw-12rem)] md:w-[calc(50vw-4rem)] max-w-sm"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Image Container - Responsive */}
                    <div className="relative bg-transparent backdrop-blur-sm border border-gray-700/30 rounded-xl p-3 xs:p-4 overflow-hidden w-full">
                      <div className="relative w-full aspect-square bg-gray-900/50 rounded-xl overflow-hidden">
                        <div className="w-full aspect-square bg-transparent rounded-lg overflow-hidden border border-white/10 relative">
                          {videoCheck ? (
                            <div className="w-full h-full bg-black rounded-lg overflow-hidden">
                              <video
                                src={image}
                                className="w-full h-full object-contain"
                                controls
                                preload="auto"
                                muted
                                playsInline
                                webkit-playsinline="true"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error('📱 Mobile video error:', e)
                                  console.error('📱 Failed mobile video URL:', image)
                                }}
                                onLoadStart={() => console.log('📱 Mobile video loading:', image)}
                                onLoadedData={() => console.log('📱 Mobile video loaded:', image)}
                                onCanPlay={() => console.log('📱 Mobile video can play:', image)}
                                onPlay={() => console.log('📱 Mobile video playing:', image)}
                                onPause={() => console.log('📱 Mobile video paused:', image)}
                                onTouchStart={(e) => {
                                  // Handle mobile touch for play/pause
                                  const video = e.target as HTMLVideoElement
                                  if (video.paused) {
                                    video.play().catch(err => console.error('Mobile play failed:', err))
                                  } else {
                                    video.pause()
                                  }
                                }}
                                onClick={(e) => {
                                  const video = e.target as HTMLVideoElement
                                  if (video.paused) {
                                    video.play().catch(err => console.error('Mobile play failed:', err))
                                  } else {
                                    video.pause()
                                  }
                                }}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  backgroundColor: 'black',
                                  cursor: 'pointer'
                                }}
                              >
                                <source src={image} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Generated image ${index + 1}`}
                              width={400}
                              height={400}
                              className="w-full h-full object-contain"
                              onError={(e) => console.error('📱 Mobile image error:', e)}
                              unoptimized={image?.includes('/static/videos/')} // Don't optimize video files
                            />
                          )}
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
                  )
                })}
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
          modelSelection={selectedModel}
          stylePalette={selectedStyle || ""}
          imageQuality={selectedQuality}
          frameSize={selectedAspectRatio}
          numberOfItems={numberOfImages}
          itemLabel="Images"
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
