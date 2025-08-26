import Link from "next/link"
import Image from "next/image"
import { VIDEOGENERATION } from "@/routes/routes"
interface FeatureItem {
  title: string
  href: string
  icon: string
  coming?: boolean
}

const videoFeatures: FeatureItem[] = [
  { title: "Text to Video",  href: VIDEOGENERATION.VIDEO_GENERATION, icon: "🎬" },
  { title: "Image to Video", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "🎞️" },
  { coming: true, title: "VFX AI", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "✨" },
  { coming: true, title: "Face Swap", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "🔄" },
  { coming: true, title: "Character Swap", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "👥" },
  { coming: true, title: "Video Enhancement", href: VIDEOGENERATION.VIDEO_GENERATION, icon: "⚡" },
]

export default function VideoGeneration() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
              <Image src="/IMAGEGENERATIONNEW/navigationcategory/imagenav.png" width={24} height={24} alt="Video Generation" className="inline-block mr-3 flex-shrink-0" />
              <span className="flex items-center ">Video Generation</span>
      </h3>
            <div className="space-y-3">
        {videoFeatures.map((feature, index) => (
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
