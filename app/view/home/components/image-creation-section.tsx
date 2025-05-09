"use client"
import ImageCard from "./image-card"
import ScrollableContainer from "./scrollable-container"
import { getImageUrl } from "@/routes/imageroute"

const images = [
  {
    id: 1,
    title: "Flux.1 Schnell",
    image: getImageUrl('home','fluxshanell'),
  },
  {
    id: 2,
    title: "Flux.1 Dev",
    image: getImageUrl('home','fluxdev'),
  },
  {
    id: 3,
    title: "Google's Imagen",
    image: getImageUrl('home','imagin'),
  },
  {
    id: 4,
    title: "Stable Diffusion 3.5 Large",
    image: getImageUrl('home','large'),
  },
  {
    id: 5,
    title: "Flux.1 Schnell",
    image: getImageUrl('home','medium'),
  },
  {
    id: 6,
    title: "Stable Diffusion 3.5 Medium",
    image: getImageUrl('home','xl'),
  },
]

export default function ImageCreationSection() {
  return (
    <section className="mb-24 px-4 md:px-6 ml-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-[268px] h-[43px] bg-slate-400 text-black text-[30px] font-bold rounded-[10px] flex items-center justify-center">Image Creation</div>
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

