"use client"
import ImageCard from "./image-card"
import ScrollableContainer from "./scrollable-container"

const images = [
  {
    id: 1,
    title: "Flux.1 Schnell",
    image: "/home/flux-schnell.jpg?height=468&width=354",
  },
  {
    id: 2,
    title: "Flux.1 Dev",
    image: "/home/flux-dev.jpg?height=468&width=354",
  },
  {
    id: 3,
    title: "Google's Imagen",
    image: "/home/google-imagen.jpg?height=468&width=354",
  },
  {
    id: 4,
    title: "Stable Diffusion 3.5 Large",
    image: "/home/stable-diffusion.jpg?height=468&width=354",
  },
  {
    id: 5,
    title: "Flux.1 Schnell",
    image: "/home/midjourney.jpg?height=468&width=354",
  },
  {
    id: 6,
    title: "Stable Diffusion 3.5 Medium",
    image: "/home/dall-e-2.jpg?height=468&width=354",
  },
]

export default function ImageCreationSection() {
  return (
    <section className="mb-24 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-[268px] h-[43px] bg-gradient-to-r from-[#5AD7FF] via-[#5AD7FF] to-[#656BF5] text-black text-[30px] font-bold rounded-[10px] flex items-center justify-center">Image Creation</div>
        <p className="text-white text-sm md:text-base font-[18px]">Create and explore image, video and audio AI powered tools</p>
      </div>

      <div className="relative">
        <ScrollableContainer>
          {images.map((image) => (
            <div key={image.id} className="snap-center">
              <ImageCard title={image.title} image={image.image} />
            </div>
          ))}
        </ScrollableContainer>
      </div>

      <div className="mt-16">
        <div className="flex items-center gap-4">
          <div className="bg-blue-300 text-blue-900 px-4 py-1 rounded-full font-medium">
            See what others are creating
          </div>
          <p className="text-white text-sm md:text-base">Create and explore image, video and audio AI powered tools</p>
        </div>
      </div>
    </section>
  )
}

