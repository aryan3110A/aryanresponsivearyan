"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Heart, Bookmark } from "lucide-react"

interface ArtImage {
  id: string
  src: string
  alt: string
  username: string
  model: string
  prompt: string
  liked?: boolean
  bookmarked?: boolean
}

interface MasonryLayoutProps {
  images: ArtImage[]
  onImageClick: (image: ArtImage) => void
  onLikeToggle?: (image: ArtImage) => void
  onBookmarkToggle?: (image: ArtImage) => void
  isMobile?: boolean
  isTablet?: boolean
}

export default function MasonryLayout({
  images,
  onImageClick,
  onLikeToggle,
  onBookmarkToggle,
  isMobile = false,
  isTablet = false,
}: MasonryLayoutProps) {
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)
  const [longPressedImageId, setLongPressedImageId] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<Record<string, { width: number; height: number }>>({})
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [modifiedImages, setModifiedImages] = useState<ArtImage[]>(images)
  const containerRef = useRef<HTMLDivElement>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Determine number of columns based on screen size
  const getColumns = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 3 // Default for desktop
  }

  const columns = getColumns()

  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensions: Record<string, { width: number; height: number }> = {}

      const promises = images.map((image) => {
        return new Promise<void>((resolve) => {
          const imgElement = document.createElement("img")
          imgElement.crossOrigin = "anonymous"
          imgElement.onload = () => {
            dimensions[image.id] = {
              width: imgElement.width,
              height: imgElement.height,
            }
            resolve()
          }
          imgElement.onerror = () => {
            dimensions[image.id] = { width: 500, height: 500 }
            resolve()
          }
          imgElement.src = image.src
        })
      })

      await Promise.all(promises)
      setImageDimensions(dimensions)
      setImagesLoaded(true)
    }

    loadImageDimensions()
  }, [images])

  const getColumnImages = () => {
    if (!imagesLoaded) return Array.from({ length: columns }, () => [])

    const columnHeights = Array(columns).fill(0)
    const columnImages: ArtImage[][] = Array.from({ length: columns }, () => [])

    modifiedImages.forEach((image) => {
      const dimensions = imageDimensions[image.id] || { width: 1, height: 1 }
      const ratio = dimensions.height / dimensions.width

      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

      columnImages[shortestColumnIndex].push(image)
      columnHeights[shortestColumnIndex] += ratio
    })

    return columnImages
  }

  const handleLikeToggle = (image: ArtImage, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedImages = modifiedImages.map((img) => (img.id === image.id ? { ...img, liked: !img.liked } : img))
    setModifiedImages(updatedImages)

    if (onLikeToggle) {
      onLikeToggle(image)
    }
  }

  const handleBookmarkToggle = (image: ArtImage, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedImages = modifiedImages.map((img) =>
      img.id === image.id ? { ...img, bookmarked: !img.bookmarked } : img,
    )
    setModifiedImages(updatedImages)

    if (onBookmarkToggle) {
      onBookmarkToggle(image)
    }
  }

  // Long press handlers for mobile/tablet
  const handleTouchStart = (imageId: string) => {
    if (isMobile || isTablet) {
      longPressTimerRef.current = setTimeout(() => {
        setLongPressedImageId(imageId)
      }, 500) // 500ms for long press
    }
  }

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  const handleTouchMove = () => {
    handleTouchEnd() // Cancel long press if moving
  }

  // Clear long press when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setLongPressedImageId(null)
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  if (!imagesLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading gallery...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex w-full flex-wrap" style={{ gap: 10 }}>
      {getColumnImages().map((column, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex-1" style={{ marginRight: 0 }}>
          {column.map((image) => {
            const dimensions = imageDimensions[image.id] || { width: 1, height: 1 }

            return (
              <div
                key={image.id}
                className="relative w-full cursor-pointer pb-2"
                style={{ marginBottom: 0 }}
                onMouseEnter={() => setHoveredImageId(image.id)}
                onMouseLeave={() => setHoveredImageId(null)}
                onClick={() => onImageClick(image)}
                onTouchStart={() => handleTouchStart(image.id)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: `${(dimensions.height / dimensions.width) * 100}%` }}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    sizes={isMobile ? "100vw" : isTablet ? "50vw" : "(max-width: 1024px) 33vw, 25vw"}
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Show overlay on hover for desktop or on long press for mobile/tablet */}
                {(hoveredImageId === image.id || longPressedImageId === image.id) && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-between p-4 transition-opacity duration-300 rounded-lg"
                    onClick={(e) => {
                      // This ensures clicking on the overlay still triggers the parent onClick to open the full overlay
                      e.stopPropagation()
                      onImageClick(image)
                    }}
                  >
                    <div className="flex justify-end space-x-4 mb-auto">
                      <Heart
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLikeToggle(image, e)
                        }}
                        className={`
                          w-6 h-6 
                          ${image.liked ? "text-[#FF4444] fill-current scale-125" : "text-white hover:scale-110"}
                          transform transition-all duration-300 ease-out
                          hover:drop-shadow-lg 
                          ${image.liked ? "animate-bounce-once" : "active:scale-90"}
                        `}
                      />
                      <Bookmark
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookmarkToggle(image, e)
                        }}
                        className={`
                          w-6 h-6 
                          ${image.bookmarked ? "text-[#FFA800] fill-current scale-125" : "text-white hover:scale-110"}
                          transform transition-all duration-300 ease-out
                          hover:drop-shadow-lg 
                          ${image.bookmarked ? "animate-bounce-once" : "active:scale-90"}
                        `}
                      />
                    </div>

                    <div className="text-white mt-auto">
                      <div className="flex items-center mb-2">
                        <div className="mr-2 flex items-center justify-center">
                          <Image src="/artstation/usr.png" alt="user" width={28} height={28} />
                        </div>
                        <span>{image.username}</span>
                      </div>
                      <div className="text-sm">
                        <p>
                          <span className="font-semibold">Model:</span> {image.model}
                        </p>
                        <p>
                          <span className="font-semibold">Prompt:</span> {image.prompt}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
