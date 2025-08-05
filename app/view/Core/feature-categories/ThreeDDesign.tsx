import Link from "next/link"
import Image from "next/image"
interface FeatureItem {
  title: string
  href: string
  icon: string
  coming?: boolean
}

const threeDFeatures: FeatureItem[] = [
  { title: "Text to 3D", href: "/view/IMAGEGENERATIONNEW/newtexttoimage", icon: "🎲" },
  { title: "Image to 3D", href: "/view/IMAGEGENERATIONNEW/newtexttoimage", icon: "🔮" },
]

export default function ThreeDDesign() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white mb-3 flex items-center">
              <Image src="/IMAGEGENERATIONNEW/navigationcategory/imagenav.png" width={24} height={24} alt="ThreeD Design" className="inline-block mr-3 flex-shrink-0" />
              <span className="flex items-center">3D Design</span>
      </h3>
            <div className="space-y-3">
        {threeDFeatures.map((feature, index) => (
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
