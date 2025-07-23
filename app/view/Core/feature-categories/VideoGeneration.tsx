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
  { title: "Image to Video", href: "/features/image-to-video", icon: "🎞️" },
  { title: "VFX AI", href: "/features/vfx-ai", icon: "✨" },
  { title: "Face Swap", href: "/features/face-swap", icon: "🔄" },
  { title: "Live Portrait", href: "/features/live-portrait-video", icon: "📹" },
  { title: "Character Swap", href: "/features/character-swap-video", icon: "👥" },
  { title: "Video Enhancement", href: "/features/video-enhancement", icon: "⚡" },
]

export default function VideoGeneration() {
  return (
    <div className="space-y-4">
      <h3 className=" font-semibold text-base text-[#00F0FF] md:text-[1.25rem] mb-4">
              <Image src="/IMAGEGENERATIONNEW/navigationcategory/imagenav.png" width={32} height={32} alt="Image Generation" className="inline-block mr-2" />
              Image Generation</h3>
            <div className="space-y-3 ">
        {videoFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="flex items-center text-gray-300 hover:text-white transition-all duration-200 text-sm group"
          >
            {/* <div className="w-2 h-2  rounded-full flex items-center border bg-white border-gray-700 justify-center mr-3 group-hover:bg-gray-900 transition-colors duration-200">
            </div> */}
            <span className="flex-1 font-poppins md:text-md lg:text-lg text-white/90 ml-10 mb-2">{feature.title}</span>
            {feature.coming && <span className="text-xs text-yellow-400 ml-2">(Soon)</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
