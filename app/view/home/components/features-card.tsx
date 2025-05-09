import Image from 'next/image'
import React from 'react'

interface FeaturesCardProps {
  imageSrc: string
  onClick: () => void
  label?: 'run' | 'coming'
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({ imageSrc, onClick, label = 'run' }) => {
  return (
    <div className="relative w-[400px] h-[280px] rounded-[24px] overflow-hidden shadow-lg group">
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt="illustration"
        fill
        className="object-cover"
      />

      {/* Run Button or Coming Soon */}
      {label === 'run' ? (
        <button
          onClick={onClick}
          className="absolute bottom-4 left-4 z-20 flex items-center gap-1 font-medium text-black px-4 py-2 rounded-full text-[18px] bg-[#e8e8e8] border shadow-md transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
        >
          <span className="text-xl">▶</span>Run
        </button>
      ) : (
        <div className="absolute bottom-4 left-4 z-20 font-semibold text-white bg-black/50 px-4 py-2 rounded-full text-[16px] shadow-md">
          Coming Soon
        </div>
      )}
    </div>
  )
}

export default FeaturesCard
