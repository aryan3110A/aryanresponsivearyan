'use client'

import React, { useState } from 'react'
import { ImageIcon, X } from 'lucide-react'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  onClick?: () => void
  fallbackText?: string
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  onClick,
  fallbackText = 'Image unavailable'
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDismissed(true)
  }

  // If dismissed, render nothing or minimal placeholder
  if (isDismissed) {
    return (
      <div
        className={`bg-gray-900/20 rounded-lg ${className}`}
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
        onClick={onClick}
      />
    )
  }

  // Fallback component
  if (imageError) {
    return (
      <div
        className={`bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 relative ${className}`}
        style={fill ? { width: '100%', height: '100%' } : { width, height }}
        onClick={onClick}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors"
          title="Dismiss"
        >
          <X className="w-3 h-3 text-gray-400 hover:text-white" />
        </button>

        <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
        <p className="text-sm text-center">
          {fallbackText}
        </p>
      </div>
    )
  }

  // Use native img element for simplicity and reliability
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleImageError}
      onClick={onClick}
      style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
      loading="lazy"
    />
  )
}
