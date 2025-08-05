import Link from "next/link"
import { BRANDINGKIT } from "@/routes/routes"
import Image from "next/image"
interface FeatureItem {
  title: string
  href: string
  icon: string
  coming?: boolean
}

const brandingFeatures: FeatureItem[] = [
  { title: "Logo Generation", href: BRANDINGKIT.LOGOGENERATION, icon: "🏢" },
  { title: "Mockups Generation", href:  BRANDINGKIT.MOCKUPEGNERATION, icon: "📱" },
  { title: "Product with Model Poses", href:  BRANDINGKIT.PRODUCTWITHMODELPOSEEGNERATION, icon: "🧍" },
  { title: "Product Generation", href: BRANDINGKIT.PRODUCT_GENERATION, icon: "📦" },
  { title: "Add Music in Image", href:  BRANDINGKIT.ADDMUSICINIMAGEGNERATION, icon: "🎵" },
  { title: "Add Music in Video", href:  BRANDINGKIT.ADDMUSICINVIDEOGNERATION, icon: "🎶" },
]

export default function BrandingKit() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
              <Image src="/IMAGEGENERATIONNEW/navigationcategory/imagenav.png" width={24} height={24} alt="BrandingKit" className="inline-block mr-3 flex-shrink-0" />
             <span className="flex items-center">BrandingKit</span>
      </h3>
            <div className="space-y-3">
        {brandingFeatures.map((feature, index) => (
          <Link
            key={index}
            href={feature.href}
            className="flex items-center text-gray-300 hover:text-white transition-all duration-200 text-sm group"
          >
            <span className="ml-4 ">{feature.title}</span>
            {feature.coming && <span className="text-xs text-yellow-400 ml-2">(Soon)</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
