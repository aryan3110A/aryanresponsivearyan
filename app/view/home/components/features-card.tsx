import Image from 'next/image'
import React from 'react'

interface FeaturesCardProps {
  imageSrc: string
  onClick: () => void
  label?: 'run' | 'coming'
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({ imageSrc, onClick, label = 'run' }) => {
  return (
    <div className="relative w-auto md:w-[400px] h-[170px] md:h-[280px] rounded-[24px] overflow-hidden shadow-lg group">
      {/* Background Image */}
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt="illustration"
        fill
        className="object-cover"
      />

      {/* Run Button or Coming Soon */}
      {label === 'run' ? (
        <button
          onClick={onClick}
          className="absolute bottom-2 md:bottom-4 left-4 z-20 flex items-center gap-1 font-medium text-black px-2 py-1 md:px-4 md:py-2 rounded-full text-[14px] md:text-[18px] bg-[#e8e8e8] border shadow-md transition-all duration-300 ease-in-out md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0"
        >
          <span className="text-md md:text-xl">▶</span>Run
        </button>
      ) : (
        <div className="absolute bottom-4 left-4 z-20 font-semibold text-white bg-black/50 px-2 py-1 md:px-4 md:py-2 rounded-full text-[12px] md:text-[16px] shadow-md">
          Coming Soon
        </div>
      )}
    </div>
  )
}

export default FeaturesCard
