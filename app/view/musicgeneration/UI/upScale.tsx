"use client"

interface UpScaleProps {
  upScale: boolean
  setUpScale: (v: boolean) => void
}

export default function upScale({ upScale, setUpScale }: UpScaleProps) {
  return (
    <div className="mx-2 md:mx-6 border-t border-white/15 mb-6">
    <div className="flex items-center justify-between pt-6">
        

      <div className="flex items-center gap-2">
        <span className="text-white text-lg font-medium">Up Scale</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center">
        </span>
        <button
          className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-200 ${upScale ? 'bg-[#6C3BFF]' : 'bg-gray-700'}`}
          onClick={() => setUpScale(!upScale)}
          aria-label="Toggle Up Scale"
        >
          <span
            className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${upScale ? 'translate-x-6' : ''}`}
          />
        </button>
      </div>
    </div></div>
  )
} 