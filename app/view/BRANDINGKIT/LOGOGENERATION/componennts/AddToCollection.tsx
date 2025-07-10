"use client"

import { ChevronDown } from "lucide-react"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface AddToCollectionProps {
  collections: string[]
  setCollections: (collections: string[]) => void
  isCollectionOpen: boolean
  setIsCollectionOpen: (open: boolean) => void
}

export default function AddToCollection({
  collections,
  setCollections,
  isCollectionOpen,
  setIsCollectionOpen,
}: AddToCollectionProps) {
  // Ensure open by default if not controlled by parent
  // (If controlled, parent should pass true as default)
  return (
    <div>
      <div className="mx-2 md:mx-6 border-t border-white/15 mb-2 "></div>
      <div className="flex items-center justify-between mb-4 px-2 md:px-6 cursor-pointer" onClick={() => setIsCollectionOpen(!isCollectionOpen)}>
        <div className="flex items-center gap-2">
          <h3 className="text-white text-lg md:text-xl font-medium">Add To Collection</h3>
          <Image src="/BRANDINGKIT/PRODUCTGENERATION/Iicon.svg" alt="Info" width={18} height={18} />
        </div>
        <button className="p-1">
          <ChevronDown className={`text-white h-5 w-5 transition-transform ${isCollectionOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      {isCollectionOpen && (
        <div className="space-y-3 px-2 md:px-6">
          <button
            className="flex items-center gap-3 p-0 bg-transparent border-none shadow-none focus:outline-none"
            onClick={() => setCollections([...collections, `Collection ${collections.length + 1}`])}
          >
            <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 mr-2">
              <Image src="/BRANDINGKIT/PRODUCTGENERATION/Frame.svg" alt="Add Collection" width={24} height={24} />
            </span>
            <span className="text-white text-base font-medium">Add New Collection</span>
          </button>
          <button
            className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-[#6C3BFF] bg-black/30 hover:bg-white/10 transition-all text-white text-base font-medium mt-2"
          >
            <span>View All</span>
            <ExternalLink className="w-5 h-5 text-white ml-2" />
          </button>
        </div>
      )}
    </div>
  )
} 