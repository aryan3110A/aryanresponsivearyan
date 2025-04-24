"use client"

import { useState, useEffect } from "react"
import ImageOverlay from "./components/image-overlay"
import Footer from "../Core/Footer"
import NavigationFull from "../Core/NavigationFull"
import Navigation from "../landingPage/components/Navigation"
import MasonryLayout from "./components/masorny-layout"

// Define the image data structure
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

// Sample images without hardcoded dimensions
const sampleImages: ArtImage[] = [
  {
    id: "1",
    src: "/artstation/Card.png",
    alt: "Eiffel Tower with burger",
    username: "Username",
    model: "Flux.1 Dev",
    prompt: "A giant burger in front of the Eiffel Tower with trees",
    liked: false,
    bookmarked: false,
  },
  {
    id: "2",
    src: "/artstation/Card1.png",
    alt: "Mystical forest",
    username: "Username",
    model: "Name",
    prompt: "txt txt txt txt",
    liked: false,
    bookmarked: false,
  },
  {
    id: "3",
    src: "/artstation/Card.png",
    alt: "Lighthouse",
    username: "Username",
    model: "Name",
    prompt: "A lighthouse on rocky shore",
    liked: false,
    bookmarked: false,
  },
  {
    id: "4",
    src: "/artstation/Card.png",
    alt: "Abstract art",
    username: "Username",
    model: "Name",
    prompt: "Abstract digital art",
    liked: false,
    bookmarked: false,
  },
  {
    id: "5",
    src: "/artstation/Card2.png",
    alt: "Nature scene",
    username: "Username",
    model: "Name",
    prompt: "Beautiful nature landscape",
    liked: false,
    bookmarked: false,
  },
  {
    id: "6",
    src: "/artstation/Card1.png",
    alt: "Urban cityscape",
    username: "Username",
    model: "Name",
    prompt: "Futuristic cityscape at night",
    liked: false,
    bookmarked: false,
  },
  {
    id: "7",
    src: "/artstation/Card1.png",
    alt: "Portrait",
    username: "Username",
    model: "Name",
    prompt: "Artistic portrait",
    liked: false,
    bookmarked: false,
  },
  {
    id: "8",
    src: "/artstation/Card.png",
    alt: "Space scene",
    username: "Username",
    model: "Name",
    prompt: "Nebula in deep space",
    liked: false,
    bookmarked: false,
  },
  {
    id: "9",
    src: "/artstation/Card2.png",
    alt: "Mountain landscape",
    username: "Username",
    model: "Name",
    prompt: "Mountain landscape at sunset",
    liked: false,
    bookmarked: false,
  },
  {
    id: "10",
    src: "/artstation/Card1.png",
    alt: "Wide panorama",
    username: "Username",
    model: "Name",
    prompt: "Wide panoramic landscape",
    liked: false,
    bookmarked: false,
  },
  {
    id: "11",
    src: "/artstation/Card.png",
    alt: "Eiffel Tower with burger",
    username: "Username",
    model: "Flux.1 Dev",
    prompt: "A giant burger in front of the Eiffel Tower with trees",
    liked: false,
    bookmarked: false,
  },
  {
    id: "12",
    src: "/artstation/Card2.png",
    alt: "Mountain landscape",
    username: "Username",
    model: "Name",
    prompt: "Mountain landscape at sunset",
    liked: false,
    bookmarked: false,
  },
]

export default function ArtStation() {
  const [selectedImage, setSelectedImage] = useState<ArtImage | null>(null)
  const [images, setImages] = useState(sampleImages)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleLikeToggle = (image: ArtImage) => {
    const updatedImages = images.map((img) => (img.id === image.id ? { ...img, liked: !img.liked } : img))
    setImages(updatedImages)
  }

  // Handle image bookmark toggle
  const handleBookmarkToggle = (image: ArtImage) => {
    const updatedImages = images.map((img) => (img.id === image.id ? { ...img, bookmarked: !img.bookmarked } : img))
    setImages(updatedImages)
  }

  return (
    <>
      {/* Conditional rendering based on screen size */}
      {isMobile || isTablet ? <Navigation /> : <NavigationFull />}

      <div className="w-full min-h-screen bg-black text-white p-5">
        <div className="max-w-[90%] mx-auto mt-10 md:mt-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">ArtStation Gallery</h1>
          <p className="md:text-xl mb-2 md:mb-10">Explore AI-generated artwork</p>

          {/* Use the MasonryLayout component */}
          <MasonryLayout
            images={images}
            onImageClick={setSelectedImage}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        </div>

        {/* Image Overlay Modal */}
        {selectedImage && (
          <ImageOverlay
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onLike={handleLikeToggle}
            onBookmark={handleBookmarkToggle}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        )}
      </div>

      <Footer />
    </>
  )
}
