import Link from "next/link"
import Image from "next/image"
import { MUSICGENERATION } from "@/routes/routes"
interface FeatureItem {
  title: string
  href: string
  icon: string
  coming?: boolean
}

const audioFeatures: FeatureItem[] = [
  { title: "Text to Music", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "🎼" },
  { title: "Audio to Music", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "🎧" },
  { coming: true, title: "Lyrics to Music", href: MUSICGENERATION.TEXTTOMUSICNEW, icon: "📝" },
  
]

export default function AudioGeneration() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
              <Image src="/IMAGEGENERATIONNEW/navigationcategory/imagenav.png" width={24} height={24} alt="Audio Generation" className="inline-block mr-3 flex-shrink-0" />
              <span className="flex items-center">Audio Generation</span>
      </h3>
            <div className="space-y-3">
        {audioFeatures.map((feature, index) => (
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
