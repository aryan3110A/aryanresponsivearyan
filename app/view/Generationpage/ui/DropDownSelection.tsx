'use client';

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface StylePaletteDropdownProps {
  title?: string
  options: string[]
  onSelect: (selected: string) => void
}

export default function DropDownSelection({
  title = "Style Palettes",
  options,
  onSelect,
}: StylePaletteDropdownProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (option: string) => {
    setSelected(option)
    onSelect(option)
  }

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between mb-4"
      >
        <span className="text-lg font-semibold">{title}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleClick(option)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 bg-[#1f1f1f] hover:bg-[#2b2b2b] border ${
                selected === option ? "border-violet-500" : "border-transparent"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}



// how to use it

// import StylePaletteDropdown from "@/components/StylePaletteDropdown"

// export default function Example() {
//   const handleStyleSelect = (style: string) => {
//     console.log("Selected style:", style)
//   }

//   return (
//     <StylePaletteDropdown
//       options={[
//         "3d Render",
//         "Bokeh",
//         "Cinematic",
//         "Creative",
//         "Graphic Design Pop Art",
//         "Graphic Design Vector",
//         "Illustration",
//         "Minimalist",
//         "Portrait",
//         "Pro B&W Photography",
//       ]}
//       onSelect={handleStyleSelect}
//     />
//   )
// }