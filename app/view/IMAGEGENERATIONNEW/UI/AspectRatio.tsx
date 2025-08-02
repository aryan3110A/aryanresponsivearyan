"use client"

interface AspectRatioOption {
  label: string
  icon: string
}

interface AspectRatioProps {
  onAspectRatioSelect?: (ratio: string) => void
  selectedAspectRatio?: string
  title?: string
  ratios?: AspectRatioOption[]
  className?: string
}

export default function AspectRatio({ 
  onAspectRatioSelect, 
  selectedAspectRatio = "16:9",
  title = "Frame Size",
  ratios = [
    { label: "21:9", icon: "▬" },
    { label: "16:9", icon: "▭" },
    { label: "9:16", icon: "▬" },
    { label: "9:21", icon: "▬" }
  ],
  className = ""
}: AspectRatioProps) {
  // Use the prop directly instead of internal state
  const selected = selectedAspectRatio

  const handleSelect = (ratio: string) => {
    console.log("AspectRatio - Selected:", ratio)
    if (onAspectRatioSelect) {
      onAspectRatioSelect(ratio)
    }
  }

  // Update the button selection logic
  return (
    <div className={className}>
      <div className="mx-2 md:mx-6 border-t border-white/15 mb-6"></div>
      <h3 className="text-white text-lg md:text-xl font-medium mb-4 px-2 md:px-6">{title}</h3>
      <div className="grid grid-cols-4 gap-2 md:gap-4 px-2 md:px-6">
        {ratios.map((ratio) => (
          <button
            key={ratio.label}
            className={`h-[60px] border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
              selected === ratio.label 
              ? "border-[#6C3BFF] text-white bg-white/10" 
              : "text-gray-300 border-transparent bg-white/10 backdrop-blur-3xl hover:border-[#6C3BFF] hover:text-white"
            }`}
            onClick={() => handleSelect(ratio.label)}
          >
            <div className="text-lg mb-1">{ratio.icon}</div>
            <span className="text-xs md:text-sm font-medium">{ratio.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

