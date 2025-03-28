import Image from "next/image"
import MySvg from "@/public/ImageGeneate/phnx.svg" // Adjust path based on your folder structure

interface ModelCard {
  id: string
  title: string
  description: string
}

export default function Models() {
  const models: ModelCard[] = [
    {
      id: "1",
      title: "Phoenix",
      description: "Unique turnkey solution for video analytics, optimized for real-time performance on off-the-grid Edge AI devices and green computing.",
    },
    {
      id: "2",
      title: "Flux.1 Dev",
      description:
        "Flux.1 Dev, a powerful 12B parameter flow transformer model from the FLUX series. This model delivers high-quality image generation with exceptional detail and efficiency.",
    },
    {
      id: "3",
      title: "Google's Imagen",
      description:
        "Google’s Imagen - generating images with even better detail, richer lightingand fewer distracting artifacts than our previous models.",
    },
    {
      id: "4",
      title: "Stable Diffusion 3.5 Medium",
      description:
        "Stable Diffusion 3.5 Medium With 2.5B parameters and enhanced MMDiT-X architecture, this model runs efficiently on consumer hardware, balancing quality and customization while generating images from 0.25 to 2 MP.",
    },
    {
      id: "5",
      title: "MidJourney + Flux Dev + LoRA",
      description:
        "A powerful fusion of MidJourney’s artistic capabilities, Flux-Dev’s efficiency, and LoRA fine-tuning, enabling highly customized, stylistic, and efficient AI-generated imagery.",
    },
    {
      id: "6",
      title: "Stable Diffusion XL",
      description:
        "Get involved with the fastest growing open software project. Download and join other developers in creating incredible applications with Stable Diffusion XL as a foundation model.",
    },
   
  ]

  return (
    <div className="bg-[#0F0F0F] min-h-screen w-full flex justify-center">
      <div className="bg-[#171717]  rounded-xl shadow-lg w-full max-w-6xl relative">
        {/* Sticky Header */}
        <div className="sticky top-0 w-full bg-[#292929] p-7 z-10">
          <h1 className=" font-poppins text-[22px] font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#5AD7FF] via-[#5AD7FF] to-[#656BF5]">
            Models and Presets
          </h1>
        </div>

        {/* Grid Layout with Auto Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-full p-6">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Card Component
function ModelCard({ model }: { model: ModelCard }) {
  return (
    <div className="rounded-xl overflow-hidden transition-transform hover:scale-105 bg-[#1E1E1E] shadow-md group w-full h-[185px]">
      <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden">
        {/* Use Local SVG */}
        <Image
          src={MySvg || "/placeholder.svg"}
          alt={`${model.title} Thumbnail`}
          className="w-full h-full object-cover"
          width={198}
          height={185}
        />

        {/* Title Overlay at Bottom */}
        <div className="absolute bottom-0 w-full h-[40px] bg-gradient-to-t from-[#292929] to-[#292929]/50 flex items-center justify-center">
          <p className="text-white font-semibold text-[12px] text-left px-2 truncate font-poppins">{model.title}</p>
        </div>

        {/* Description Overlay on Hover */}
        {/* Description Overlay on Hover */}
        <div className="absolute bottom-0 w-full h-0 bg-black/90 flex items-start opacity-0 group-hover:opacity-100 group-hover:h-full transition-all duration-300 overflow-hidden">
          <div className="p-3 text-white text-left w-full font-poppins">
            <p className="text-xs">{model.description}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
