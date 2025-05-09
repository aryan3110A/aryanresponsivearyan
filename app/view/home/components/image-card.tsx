"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import ImageModal from "./image-modal"

interface ImageCardProps {
  title: string
  image: string
}

export default function ImageCard({ title, image }: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <div
        className="
          rounded-[45px] overflow-hidden
          w-[354px] h-[488px] aspect-[3/4] mx-auto transition-all duration-100
          border-b-4 border-b-[#B1B1B1]
          cursor-pointer
        "
        onClick={openModal}
      >
        {/* Image container */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={image || "/home/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 280px) 100vw, 280px"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          {/* Title */}
          <div className="absolute top-4 left-4">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>

          {/* Run button */}
          <div className="absolute bottom-4 left-4">
            <button
              className="
                bg-[#357AFF] hover:bg-[#252525] text-white 
                rounded-[10px] flex items-center px-5 py-2 
                text-sm font-medium transition-all duration-300
                shadow-md w-[83px] h-[34px]
              "
              onClick={(e) => {
                e.stopPropagation()
                // Handle run action
              }}
            >
              <Play size={14} className="fill-current" />
              <span className="ml-1">Run</span>
            </button>
          </div>
        </div>
      </div>

      {/* <ImageModal isOpen={isModalOpen} onClose={closeModal} image={{ title, image }} /> */}
    </>
  )
}

