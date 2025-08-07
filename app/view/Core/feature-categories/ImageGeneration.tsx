import Link from "next/link"
import { IMAGEGENERATION } from "@/routes/routes"
import Image from "next/image"

interface FeatureItem {
  title: string
  href: string
  coming?: boolean
}

const imageGenerationFeatures: FeatureItem[] = [
  { title: "Text to Image", href: IMAGEGENERATION.IMAGE_GENERATION, },
  { title: "Image to Image", href: IMAGEGENERATION.IMAGE2IMAGEGENERATION,},
  { coming: true, title: "AI Sticker Generation", href: IMAGEGENERATION.STICKER_GENERATION,  },
  { coming: true, title: "Live Portrait", href: IMAGEGENERATION.LIVEPORTRAIT, }, 
  { coming: true, title: "Inpaint", href: IMAGEGENERATION.INPAINTFLUXAPI, }, 
]

export default function ImageGeneration() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
        <Image src="/IMAGEGENERATIONNEW/navigationcategory/imagenav.png" width={24} height={24} alt="Image Generation" className="inline-block mr-3 flex-shrink-0" />
        <span className="flex items-center">Image Generation</span>
      </h3>
      <div className="space-y-3">
        {imageGenerationFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="flex items-center text-gray-300 hover:text-white transition-all duration-200 text-sm group"
          >
              <span className="ml-4 flex no-wrap">{feature.title}</span>
            {feature.coming && <span className="text-sm text-gray-300 ml-1 flex-shrink-0">(Soon)</span>}
          </Link>
          
        ))}
      </div> 
    </div>           
  )    
} 
