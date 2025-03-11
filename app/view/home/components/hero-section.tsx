"use client"
import { useRef, useEffect } from "react"

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error)
      })
    }
  }, [])

  return (
    <section className="relative w-full mt-8 mb-16">
      <div className="relative w-full max-w-[1286px] h-[269px] mx-auto overflow-hidden rounded-[25px]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          width="1286"
          height="269"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="./home/cosmic-clouds.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Text content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white relative z-10">
            Introducing <span className="text-amber-400">Text to Image</span>
          </h1>
        </div>
      </div>
    </section>
  )
}
