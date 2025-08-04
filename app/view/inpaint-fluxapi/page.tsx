"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Upload, Download, Settings, RotateCcw, Brush, Eraser, Square, MousePointer, Sparkles, Zap, Maximize, X } from 'lucide-react'
import { HoverBorderGradient } from "../Core/hover-border-gradient"

interface InpaintSettings {
  use_finetune: boolean
  finetune_id: string
  finetune_strength: number
  prompt: string
  steps: number
  prompt_upsampling: boolean
  seed: number | null
  guidance: number
  output_format: 'jpeg' | 'png'
  safety_tolerance: number
}

interface SavedState {
  originalImage: string | null
  maskImage: string | null
  resultImage: string | null
  settings: InpaintSettings
  brushSize: number
  selectionMode: 'brush' | 'rectangle' | 'lasso'
  canvasData: string | null
  timestamp: number
}

export default function InpaintFluxAPI() {
  // Image states
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [maskImage, setMaskImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)

  // Canvas states
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [isErasing, setIsErasing] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number } | null>(null)

  // Selection tool states
  const [selectionMode, setSelectionMode] = useState<'brush' | 'rectangle' | 'lasso'>('brush')
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null)
  const [lassoPoints, setLassoPoints] = useState<{ x: number, y: number }[]>([])
  const [isDrawingLasso, setIsDrawingLasso] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSelection, setCurrentSelection] = useState<{ x: number, y: number, width: number, height: number } | null>(null)

  // Fullscreen states
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  // UI states
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<string>('')
  
  // Download options state
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [pendingDownload, setPendingDownload] = useState<{ imageDataUrl: string, filename: string } | null>(null)

  // Settings
  const [settings, setSettings] = useState<InpaintSettings>({
    use_finetune: false, // Default to regular FLUX Fill
    finetune_id: 'my-finetune',
    finetune_strength: 1.1,
    prompt: '',
    steps: 50,
    prompt_upsampling: false,
    seed: null,
    guidance: 50.75, // Default for regular FLUX
    output_format: 'jpeg',
    safety_tolerance: 2
  })

  // State preservation functions
  const saveState = useCallback(() => {
    try {
      const canvas = canvasRef.current
      const canvasData = canvas ? canvas.toDataURL() : null
      
      const state: SavedState = {
        originalImage,
        maskImage,
        resultImage,
        settings,
        brushSize,
        selectionMode,
        canvasData,
        timestamp: Date.now()
      }
      
      localStorage.setItem('inpaint-fluxapi-state', JSON.stringify(state))
      console.log('✅ State saved to localStorage')
    } catch (error) {
      console.error('❌ Failed to save state:', error)
    }
  }, [originalImage, maskImage, resultImage, settings, brushSize, selectionMode])

  const loadState = () => {
    try {
      const savedState = localStorage.getItem('inpaint-fluxapi-state')
      if (savedState) {
        const state: SavedState = JSON.parse(savedState)
        
        // Check if state is not too old (24 hours)
        const isRecent = Date.now() - state.timestamp < 24 * 60 * 60 * 1000
        
        if (isRecent) {
          setOriginalImage(state.originalImage)
          setMaskImage(state.maskImage)
          setResultImage(state.resultImage)
          setSettings(state.settings)
          setBrushSize(state.brushSize)
          setSelectionMode(state.selectionMode)
          
          // Restore canvas data
          if (state.canvasData && canvasRef.current) {
            const img = new window.Image()
            img.onload = () => {
              const canvas = canvasRef.current
              if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height)
                  ctx.drawImage(img, 0, 0)
                }
              }
            }
            img.src = state.canvasData
          }
          
          console.log('✅ State restored from localStorage')
          return true
        } else {
          localStorage.removeItem('inpaint-fluxapi-state')
          console.log('🕒 Saved state is too old, cleared')
        }
      }
    } catch (error) {
      console.error('❌ Failed to load state:', error)
      localStorage.removeItem('inpaint-fluxapi-state')
    }
    return false
  }

  // Auto-save state when important changes occur
  useEffect(() => {
    if (originalImage || maskImage || resultImage) {
      saveState()
    }
  }, [originalImage, maskImage, resultImage, settings, brushSize, selectionMode, saveState])

  // Load state on component mount
  useEffect(() => {
    loadState()
  }, [])

  // Helper function to draw smooth lines
  const drawLine = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    if (isErasing) {
      // For erasing, use destination-out with a round brush
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize * 10
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
    } else {
      // For painting, use source-over with bright cyan color
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)' // More opaque for better detection
      ctx.lineWidth = brushSize * 10
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
    }
  }

  // Helper function to draw a single point
  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(0, 255, 255, 0.8)' // More opaque for better detection
    }
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Marching ants animation
  const [marchingAntsOffset, setMarchingAntsOffset] = useState(0)

  // Function to show download options
  const showDownloadOptionsModal = (imageDataUrl: string, filename: string) => {
    setPendingDownload({ imageDataUrl, filename })
    setShowDownloadOptions(true)
  }

  // Enhanced download function with options
  const downloadImage = (imageDataUrl: string, filename: string, openInNewTab = false) => {
    if (openInNewTab) {
      // Save state before opening new tab
      saveState()
      
      // Open image in new tab
      const newWindow = window.open(imageDataUrl, '_blank')
      if (newWindow) {
        newWindow.focus()
        console.log(`✅ Opened image in new tab: ${filename}`)
      } else {
        console.log(`❌ Failed to open new tab, falling back to download`)
        // Fallback to direct download if popup is blocked
        const link = document.createElement('a')
        link.href = imageDataUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      // Direct download
      const link = document.createElement('a')
      link.href = imageDataUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log(`✅ Downloaded: ${filename}`)
    }
  }

  // Function to handle download choice
  const handleDownloadChoice = (openInNewTab: boolean) => {
    if (pendingDownload) {
      downloadImage(pendingDownload.imageDataUrl, pendingDownload.filename, openInNewTab)
      setShowDownloadOptions(false)
      setPendingDownload(null)
    }
  }

  // Animation for marching ants
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMarchingAntsOffset(prev => (prev + 1) % 8)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Keyboard support for fullscreen modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFullscreen) {
        setShowFullscreen(false)
      }
    }

    if (showFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [showFullscreen])

  // Professional selection drawing functions
  const drawMarchingAnts = (ctx: CanvasRenderingContext2D, path: Path2D) => {
    ctx.save()
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.lineDashOffset = marchingAntsOffset
    ctx.stroke(path)
    ctx.restore()
  }

  const drawRectangleSelection = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    // Fill the rectangle with cyan color for inpainting
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'
    ctx.fillRect(x, y, width, height)
    
    // Draw selection rectangle with marching ants border
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.lineDashOffset = marchingAntsOffset
    ctx.strokeRect(x, y, width, height)
    ctx.setLineDash([])
  }

  const drawLassoSelection = (ctx: CanvasRenderingContext2D, points: { x: number, y: number }[], isComplete = true) => {
    if (points.length < 2) return

    // Create smooth path for the lasso selection
    const path = new Path2D()
    path.moveTo(points[0].x, points[0].y)

    // Use quadratic curves for smoother lines
    for (let i = 1; i < points.length; i++) {
      if (i === points.length - 1 && isComplete) {
        // Close the path smoothly
        path.lineTo(points[i].x, points[i].y)
        path.closePath()
      } else if (i < points.length - 1) {
        // Create smooth curves between points
        const currentPoint = points[i]
        const nextPoint = points[i + 1]
        const controlX = (currentPoint.x + nextPoint.x) / 2
        const controlY = (currentPoint.y + nextPoint.y) / 2
        path.quadraticCurveTo(currentPoint.x, currentPoint.y, controlX, controlY)
      } else {
        path.lineTo(points[i].x, points[i].y)
      }
    }

    if (isComplete) {
      // Fill the selection area with cyan
      ctx.save()
      ctx.fillStyle = 'rgba(0, 255, 255, 0.3)'
      ctx.fill(path)
      ctx.restore()

      // Draw marching ants border
      drawMarchingAnts(ctx, path)
    } else {
      // Draw preview line while drawing
      ctx.save()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.stroke(path)
      ctx.restore()
    }

    // Don't show individual control points for smooth lasso - it's not Photoshop-like
    // Photoshop lasso doesn't show individual points, just the smooth selection
  }

  // Smooth lasso drawing with automatic point sampling
  const addLassoPoint = (x: number, y: number) => {
    if (lassoPoints.length === 0) {
      lassoPoints.push({ x, y })
    } else {
      const lastPoint = lassoPoints[lassoPoints.length - 1]
      const distance = Math.sqrt((x - lastPoint.x) ** 2 + (y - lastPoint.y) ** 2)
      if (distance > 5) { // Only add point if it's far enough from last point
        lassoPoints.push({ x, y })
      }
    }
  }

  // Generate mask from canvas - following Black Forest Labs specifications
  const generateMask = () => {
    const canvas = canvasRef.current
    const originalImg = document.querySelector('img') as HTMLImageElement

    if (canvas && originalImg) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Create mask canvas with EXACT same dimensions as original image
        const maskCanvas = document.createElement('canvas')
        maskCanvas.width = originalImg.naturalWidth  // Use natural dimensions
        maskCanvas.height = originalImg.naturalHeight
        const maskCtx = maskCanvas.getContext('2d')

        if (maskCtx) {
          // Fill with pure black background (RGB: 0,0,0)
          maskCtx.fillStyle = '#000000'
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)

          // Scale the painted canvas to match original image dimensions
          const scaleX = originalImg.naturalWidth / canvas.width
          const scaleY = originalImg.naturalHeight / canvas.height

          // Get the painted canvas data
          const paintedData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const paintedPixels = paintedData.data

          // Create scaled mask data
          const maskImageData = maskCtx.createImageData(maskCanvas.width, maskCanvas.height)
          const maskData = maskImageData.data

          // Process each pixel in the mask (scaled to original image size)
          for (let y = 0; y < maskCanvas.height; y++) {
            for (let x = 0; x < maskCanvas.width; x++) {
              const maskIndex = (y * maskCanvas.width + x) * 4

              // Map back to painted canvas coordinates
              const paintedX = Math.floor(x / scaleX)
              const paintedY = Math.floor(y / scaleY)
              const paintedIndex = (paintedY * canvas.width + paintedX) * 4

              if (paintedIndex < paintedPixels.length) {
                const r = paintedPixels[paintedIndex]
                const g = paintedPixels[paintedIndex + 1]
                const b = paintedPixels[paintedIndex + 2]
                const a = paintedPixels[paintedIndex + 3]

                // Detect cyan painted areas (including rectangle selections)
                const isCyan = a > 50 && g > 150 && b > 150 && r < 150

                if (isCyan) {
                  // Pure white (255,255,255) for inpainting areas
                  maskData[maskIndex] = 255     // R
                  maskData[maskIndex + 1] = 255 // G
                  maskData[maskIndex + 2] = 255 // B
                  maskData[maskIndex + 3] = 255 // A
                } else {
                  // Pure black (0,0,0) for preserved areas
                  maskData[maskIndex] = 0       // R
                  maskData[maskIndex + 1] = 0   // G
                  maskData[maskIndex + 2] = 0   // B
                  maskData[maskIndex + 3] = 255 // A
                }
              } else {
                // Default to black if out of bounds
                maskData[maskIndex] = 0
                maskData[maskIndex + 1] = 0
                maskData[maskIndex + 2] = 0
                maskData[maskIndex + 3] = 255
              }
            }
          }

          maskCtx.putImageData(maskImageData, 0, 0)
          const maskDataURL = maskCanvas.toDataURL('image/png')
          setMaskImage(maskDataURL)

          // Count white pixels for validation
          let whitePixels = 0
          for (let i = 0; i < maskData.length; i += 4) {
            if (maskData[i] === 255 && maskData[i + 1] === 255 && maskData[i + 2] === 255) {
              whitePixels++
            }
          }

          const totalPixels = maskData.length / 4
          const whitePercentage = (whitePixels / totalPixels) * 100

          console.log('🎭 BFL-compliant mask generated:', {
            originalImageDimensions: `${originalImg.naturalWidth}x${originalImg.naturalHeight}`,
            maskDimensions: `${maskCanvas.width}x${maskCanvas.height}`,
            dimensionsMatch: maskCanvas.width === originalImg.naturalWidth && maskCanvas.height === originalImg.naturalHeight,
            totalPixels,
            whitePixels,
            blackPixels: totalPixels - whitePixels,
            whitePercentage: whitePercentage.toFixed(2) + '%',
            isValidMask: whitePixels > 100,
            maskFormat: 'Pure black/white as per BFL specs'
          })
        }
      }
    }
  }

  // Validate mask follows BFL specifications
  const validateMask = () => {
    if (!maskImage) {
      console.error('❌ No mask image generated')
      return false
    }

    const originalImg = document.querySelector('img') as HTMLImageElement
    if (!originalImg) {
      console.error('❌ No original image found')
      return false
    }

    return new Promise<boolean>((resolve) => {
      const tempImg = document.createElement('img')
      tempImg.onload = () => {
        // Check dimensions match original image
        const dimensionsMatch = tempImg.naturalWidth === originalImg.naturalWidth &&
                               tempImg.naturalHeight === originalImg.naturalHeight

        if (!dimensionsMatch) {
          console.error('❌ Mask dimensions do not match original image:', {
            originalDimensions: `${originalImg.naturalWidth}x${originalImg.naturalHeight}`,
            maskDimensions: `${tempImg.naturalWidth}x${tempImg.naturalHeight}`
          })
          resolve(false)
          return
        }

        // Check mask has white pixels
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = tempImg.naturalWidth
        tempCanvas.height = tempImg.naturalHeight
        const tempCtx = tempCanvas.getContext('2d')

        if (tempCtx) {
          tempCtx.drawImage(tempImg, 0, 0)
          const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
          const data = imageData.data

          let whitePixels = 0
          let blackPixels = 0

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            if (r === 255 && g === 255 && b === 255) {
              whitePixels++
            } else if (r === 0 && g === 0 && b === 0) {
              blackPixels++
            }
          }

          const totalPixels = data.length / 4
          const whitePercentage = (whitePixels / totalPixels) * 100
          const isValidMask = whitePixels > 100 && dimensionsMatch

          console.log('✅ BFL Mask validation:', {
            dimensionsMatch,
            originalDimensions: `${originalImg.naturalWidth}x${originalImg.naturalHeight}`,
            maskDimensions: `${tempImg.naturalWidth}x${tempImg.naturalHeight}`,
            totalPixels,
            whitePixels,
            blackPixels,
            whitePercentage: whitePercentage.toFixed(2) + '%',
            isValidMask,
            meetsSpecifications: dimensionsMatch && whitePixels > 100
          })

          resolve(isValidMask)
        } else {
          resolve(false)
        }
      }

      tempImg.onerror = () => {
        console.error('❌ Failed to load mask image for validation')
        resolve(false)
      }

      tempImg.src = maskImage
    })
  }

  // Generate inpainting
  const handleGenerate = async () => {
    if (!originalImage || !settings.prompt.trim()) {
      setError('Please upload an image and enter a prompt')
      return
    }

    // Validate mask follows BFL specifications
    const isValidMask = await validateMask()
    if (!isValidMask) {
      setError('Invalid mask: Please ensure mask dimensions match image and contains white areas for inpainting')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGenerationStatus('Submitting task...')

    try {
      // Helper function to clean base64 data URLs
      const cleanBase64 = (dataUrl: string | null): string => {
        if (dataUrl && dataUrl.includes(',')) {
          return dataUrl.split(',')[1]
        }
        return dataUrl || ''
      }

      // Clean the base64 data before sending
      const cleanImage = cleanBase64(originalImage)
      const cleanMask = cleanBase64(maskImage)

      console.log('🧹 Cleaning base64 data:', {
        originalImagePrefix: originalImage?.substring(0, 50),
        originalMaskPrefix: maskImage?.substring(0, 50),
        cleanImageLength: cleanImage?.length,
        cleanMaskLength: cleanMask?.length,
        imageHadPrefix: originalImage?.includes('data:'),
        maskHadPrefix: maskImage?.includes('data:')
      })

      // Additional mask debugging - create a temporary image to verify mask content
      if (maskImage && typeof window !== 'undefined') {
        const tempImg = document.createElement('img')
        tempImg.onload = () => {
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = tempImg.width
          tempCanvas.height = tempImg.height
          const tempCtx = tempCanvas.getContext('2d')
          if (tempCtx) {
            tempCtx.drawImage(tempImg, 0, 0)
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
            const data = imageData.data

            let whitePixels = 0
            let blackPixels = 0
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              const brightness = (r + g + b) / 3

              if (brightness > 200) whitePixels++
              else if (brightness < 50) blackPixels++
            }

            console.log('🔍 Final mask analysis:', {
              dimensions: `${tempCanvas.width}x${tempCanvas.height}`,
              totalPixels: data.length / 4,
              whitePixels,
              blackPixels,
              whitePercentage: ((whitePixels / (data.length / 4)) * 100).toFixed(2) + '%',
              isValidMask: whitePixels > 100
            })
          }
        }
        tempImg.src = maskImage
      }

      // Submit inpainting task
      const response = await fetch('/api/flux-inpaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          use_finetune: settings.use_finetune,
          ...(settings.use_finetune && {
            finetune_id: settings.finetune_id,
            finetune_strength: settings.finetune_strength,
          }),
          image: cleanImage,
          mask: cleanMask,
          prompt: settings.prompt,
          steps: settings.steps,
          prompt_upsampling: settings.prompt_upsampling,
          seed: settings.seed,
          guidance: settings.guidance,
          output_format: settings.output_format,
          safety_tolerance: settings.safety_tolerance
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit inpainting task')
      }

      const data = await response.json()
      setGenerationStatus('Task submitted, generating...')

      // Poll for results
      pollForResults(data.id)

    } catch (error) {
      console.error('Generation failed:', error)
      setError('Failed to generate inpainting. Please try again.')
      setIsGenerating(false)
      setGenerationStatus('')
    }
  }

  // Poll for results
  const pollForResults = async (id: string) => {
    const maxAttempts = 60 // 5 minutes with 5-second intervals
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/flux-inpaint?id=${id}`)
        const data = await response.json()

        if (data.status === 'Ready' && data.result?.sample) {
          setResultImage(data.result.sample)
          setIsGenerating(false)
          setGenerationStatus('')
          console.log('✅ Generation completed successfully:', {
            duration: data.result.duration,
            seed: data.result.seed,
            imageUrl: data.result.sample
          })
          return
        }

        if (data.status === 'failed' || data.status === 'Failed') {
          setError(data.error || 'Generation failed')
          setIsGenerating(false)
          setGenerationStatus('')
          console.error('❌ Generation failed:', data)
          return
        }

        // Continue polling if still pending
        if (data.status === 'Pending' || data.status === 'pending') {
          console.log(`⏳ Still generating... (attempt ${attempts + 1}/${maxAttempts})`)
          setGenerationStatus(`Generating... (${attempts + 1}/${maxAttempts})`)
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000) // Poll every 5 seconds
          } else {
            setError('Generation timed out. Please try again.')
            setIsGenerating(false)
            setGenerationStatus('')
          }
        } else {
          // Unknown status
          console.warn('⚠️ Unknown status:', data.status)
          setError(`Unknown status: ${data.status}`)
          setIsGenerating(false)
          setGenerationStatus('')
        }

      } catch (error) {
        console.error('Polling error:', error)
        setError('Failed to check generation status')
        setIsGenerating(false)
        setGenerationStatus('')
      }
    }

    poll()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#6C3BFF] to-[#412399] rounded-xl flex items-center justify-center">
                <Brush className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FLUX.1 Fill Pro</h1>
                <p className="text-gray-400 text-sm">AI-powered image inpainting with FLUX.1 Fill model</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors border border-gray-600"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Image Upload & Canvas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            {!originalImage ? (
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center bg-gray-800/20">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Your Image</h3>
                <p className="text-gray-400 mb-6">Choose an image to start inpainting</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => setOriginalImage(e.target?.result as string)
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C3BFF] to-[#412399] hover:from-[#5A2FE6] hover:to-[#351F7A] rounded-xl font-medium cursor-pointer transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Choose Image
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Status & Remove Button */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 font-medium">Image loaded successfully</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => setOriginalImage(e.target?.result as string)
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                        id="image-replace"
                      />
                      <label
                        htmlFor="image-replace"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors cursor-pointer text-sm"
                        title="Upload a different image"
                      >
                        <Upload className="w-4 h-4" />
                        Replace
                      </label>
                      <button
                        onClick={() => {
                          // Reset image and canvas states but keep prompt and settings
                          setOriginalImage(null)
                          setMaskImage(null)
                          setLassoPoints([])
                          setIsSelecting(false)
                          setIsDrawingLasso(false)
                          setSelectionStart(null)
                          setIsDrawing(false)
                          setLastPosition(null)
                          setError(null)

                          // Clear canvas
                          const canvas = canvasRef.current
                          if (canvas) {
                            const ctx = canvas.getContext('2d')
                            ctx?.clearRect(0, 0, canvas.width, canvas.height)
                          }

                          console.log('🗑️ Image removed, ready for new upload')
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm"
                        title="Remove current image"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                  <p className="text-cyan-300 text-sm flex items-center gap-2">
                    {selectionMode === 'brush' && <Brush className="w-4 h-4" />}
                    {selectionMode === 'rectangle' && <Square className="w-4 h-4" />}
                    {selectionMode === 'lasso' && <MousePointer className="w-4 h-4" />}
                    <span>
                      {selectionMode === 'brush' && !isErasing && "Paint over areas you want to modify (cyan areas will be inpainted)"}
                      {selectionMode === 'brush' && isErasing && "Erase mask areas to exclude them from inpainting"}
                      {selectionMode === 'rectangle' && "Click and drag to create rectangular selection with marching ants"}
                      {selectionMode === 'lasso' && "Click and drag to draw a smooth outline around the object"}
                    </span>
                  </p>
                </div>

                {/* Canvas Tools */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  {/* Selection Mode Buttons */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-400">Selection Mode:</span>
                    <button
                      onClick={() => setSelectionMode('brush')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all transform ${
                        selectionMode === 'brush'
                          ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/25 scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      <Brush className="w-4 h-4" />
                      Brush
                    </button>
                    <button
                      onClick={() => setSelectionMode('rectangle')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all transform ${
                        selectionMode === 'rectangle'
                          ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/25 scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      <Square className="w-4 h-4" />
                      Rectangle
                    </button>
                    <button
                      onClick={() => setSelectionMode('lasso')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all transform ${
                        selectionMode === 'lasso'
                          ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/25 scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      <MousePointer className="w-4 h-4" />
                      Lasso
                    </button>
                  </div>

                  {/* Brush Tools (only show for brush mode) */}
                  {selectionMode === 'brush' && (
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => setIsErasing(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform ${
                          !isErasing
                            ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/25 scale-105'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                        }`}
                      >
                        <Brush className="w-4 h-4" />
                        Paint
                        {!isErasing && <div className="w-2 h-2 bg-white rounded-full ml-1"></div>}
                      </button>
                      <button
                        onClick={() => setIsErasing(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform ${
                          isErasing
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                        }`}
                      >
                        <Eraser className="w-4 h-4" />
                        Erase
                        {isErasing && <div className="w-2 h-2 bg-white rounded-full ml-1"></div>}
                      </button>
                    </div>
                  )}

                  {/* Tool Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Brush Size (only for brush mode) */}
                      {selectionMode === 'brush' && (
                        <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-400">Size:</span>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-24 accent-[#6C3BFF]"
                          />
                          <span className="text-sm text-white w-8 font-mono">{brushSize}px</span>
                          {/* Visual size indicator */}
                          <div className="flex items-center justify-center w-8 h-8">
                            <div
                              className={`rounded-full border-2 ${
                                isErasing ? 'border-red-400 bg-red-400/20' : 'border-cyan-400 bg-cyan-400/20'
                              }`}
                              style={{
                                width: Math.max(4, Math.min(brushSize / 2, 24)),
                                height: Math.max(4, Math.min(brushSize / 2, 24)),
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const canvas = canvasRef.current
                          if (canvas) {
                            const ctx = canvas.getContext('2d')
                            ctx?.clearRect(0, 0, canvas.width, canvas.height)
                            setMaskImage(null)
                            setLassoPoints([])
                            setIsSelecting(false)
                            setIsDrawingLasso(false)
                            setSelectionStart(null)
                            setIsDrawing(false)
                            setLastPosition(null)
                            console.log('🧹 All selections cleared')
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Clear All
                      </button>

                      {/* Debug: Create Professional Test Selection */}
                      <button
                        onClick={() => {
                          const canvas = canvasRef.current
                          const originalImg = document.querySelector('img') as HTMLImageElement

                          if (canvas && originalImg) {
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              // Clear all selections first
                              ctx.clearRect(0, 0, canvas.width, canvas.height)
                              setLassoPoints([])
                              setIsSelecting(false)
                              setIsDrawingLasso(false)

                              // Create a professional test rectangle with cyan fill
                              const centerX = canvas.width / 2
                              const centerY = canvas.height / 2
                              const rectSize = Math.min(canvas.width, canvas.height) / 3
                              const x = centerX - rectSize/2
                              const y = centerY - rectSize/2

                              // Draw professional rectangle selection with cyan fill
                              drawRectangleSelection(ctx, x, y, rectSize, rectSize)

                              // Generate BFL-compliant mask immediately
                              generateMask()
                              console.log('🧪 Professional test selection created:', {
                                originalDimensions: `${originalImg.naturalWidth}x${originalImg.naturalHeight}`,
                                selectionSize: `${rectSize}x${rectSize}`,
                                hasCyanFill: true,
                                hasMarchingAnts: true
                              })
                            }
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
                      >
                        🧪 Pro Test
                      </button>
                    </div>
                  </div>
                </div>

                {/* Canvas Container */}
                <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="relative max-w-full max-h-[600px] mx-auto">
                    {originalImage && (
                      <>
                        <Image
                          src={originalImage}
                          alt="Original"
                          width={800}
                          height={600}
                          className="max-w-full max-h-[600px] object-contain rounded-lg cursor-pointer"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement
                            const canvas = canvasRef.current
                            if (canvas) {
                              canvas.width = img.naturalWidth
                              canvas.height = img.naturalHeight
                              canvas.style.width = `${img.offsetWidth}px`
                              canvas.style.height = `${img.offsetHeight}px`
                            }
                          }}
                          onClick={() => {
                            setFullscreenImage(originalImage)
                            setShowFullscreen(true)
                          }}
                        />

                        {/* Image Control buttons */}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => {
                              setFullscreenImage(originalImage)
                              setShowFullscreen(true)
                            }}
                            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                            title="View Fullscreen"
                          >
                            <Maximize className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => showDownloadOptionsModal(originalImage, 'original-image.jpg')}
                            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                            title="Download Original"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => {
                              // Reset image and canvas states but keep prompt and settings
                              setOriginalImage(null)
                              setMaskImage(null)
                              setLassoPoints([])
                              setIsSelecting(false)
                              setIsDrawingLasso(false)
                              setSelectionStart(null)
                              setIsDrawing(false)
                              setLastPosition(null)
                              setError(null)

                              // Clear canvas
                              const canvas = canvasRef.current
                              if (canvas) {
                                const ctx = canvas.getContext('2d')
                                ctx?.clearRect(0, 0, canvas.width, canvas.height)
                              }

                              console.log('🗑️ Image removed, canvas reset')
                            }}
                            className="p-2 bg-red-600/50 hover:bg-red-600/70 rounded-lg transition-colors"
                            title="Remove Image"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </>
                    )}
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 rounded-lg"
                      style={{
                        cursor: selectionMode === 'brush' ? 'none' : 'crosshair'
                      }}
                      onMouseEnter={() => setShowCursor(selectionMode === 'brush')}
                      onMouseLeave={() => setShowCursor(false)}
                      onMouseMove={(e) => {
                        const canvas = canvasRef.current
                        if (canvas) {
                          const rect = canvas.getBoundingClientRect()
                          const scaleX = canvas.width / rect.width
                          const scaleY = canvas.height / rect.height
                          const x = (e.clientX - rect.left) * scaleX
                          const y = (e.clientY - rect.top) * scaleY

                          // Update cursor position for visual feedback
                          setCursorPosition({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                          })

                          if (selectionMode === 'brush' && isDrawing) {
                            // Brush mode drawing
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              if (lastPosition) {
                                drawLine(ctx, lastPosition.x, lastPosition.y, x, y)
                              } else {
                                drawPoint(ctx, x, y)
                              }
                              setLastPosition({ x, y })
                            }
                          } else if (selectionMode === 'rectangle' && isSelecting && selectionStart) {
                            // Rectangle selection preview
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              // Clear and redraw
                              ctx.clearRect(0, 0, canvas.width, canvas.height)
                              const width = x - selectionStart.x
                              const height = y - selectionStart.y
                              drawRectangleSelection(ctx, selectionStart.x, selectionStart.y, width, height)
                            }
                          } else if (selectionMode === 'lasso' && isDrawingLasso) {
                            // Smooth lasso drawing - add points continuously
                            addLassoPoint(x, y)

                            // Draw live preview
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              ctx.clearRect(0, 0, canvas.width, canvas.height)
                              if (lassoPoints.length > 1) {
                                drawLassoSelection(ctx, lassoPoints, false) // false = not complete yet
                              }
                            }
                          }
                        }
                      }}
                      onMouseDown={(e) => {
                        const canvas = canvasRef.current
                        if (canvas) {
                          const rect = canvas.getBoundingClientRect()
                          const scaleX = canvas.width / rect.width
                          const scaleY = canvas.height / rect.height
                          const x = (e.clientX - rect.left) * scaleX
                          const y = (e.clientY - rect.top) * scaleY

                          if (selectionMode === 'brush') {
                            setIsDrawing(true)
                            setLastPosition({ x, y })
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              drawPoint(ctx, x, y)
                            }
                          } else if (selectionMode === 'rectangle') {
                            setIsSelecting(true)
                            setSelectionStart({ x, y })
                          } else if (selectionMode === 'lasso') {
                            // Start smooth lasso drawing
                            setIsDrawingLasso(true)
                            setLassoPoints([{ x, y }])
                          }
                        }
                      }}
                      onMouseUp={(e) => {
                        if (selectionMode === 'brush') {
                          setIsDrawing(false)
                          setLastPosition(null)
                          generateMask()
                        } else if (selectionMode === 'rectangle' && isSelecting && selectionStart) {
                          const canvas = canvasRef.current
                          if (canvas) {
                            const rect = canvas.getBoundingClientRect()
                            const scaleX = canvas.width / rect.width
                            const scaleY = canvas.height / rect.height
                            const x = (e.clientX - rect.left) * scaleX
                            const y = (e.clientY - rect.top) * scaleY

                            const width = x - selectionStart.x
                            const height = y - selectionStart.y

                            if (Math.abs(width) > 5 && Math.abs(height) > 5) {
                              // Apply the selection
                              const ctx = canvas.getContext('2d')
                              if (ctx) {
                                // Clear previous selections
                                ctx.clearRect(0, 0, canvas.width, canvas.height)
                                
                                // Draw the final rectangle selection with cyan fill
                                const finalX = Math.min(selectionStart.x, x)
                                const finalY = Math.min(selectionStart.y, y)
                                const finalWidth = Math.abs(width)
                                const finalHeight = Math.abs(height)
                                
                                drawRectangleSelection(ctx, finalX, finalY, finalWidth, finalHeight)
                                
                                console.log('✅ Rectangle selection applied:', {
                                  x: finalX,
                                  y: finalY,
                                  width: finalWidth,
                                  height: finalHeight,
                                  area: finalWidth * finalHeight
                                })
                              }
                              generateMask()
                            } else {
                              // Selection too small, clear it
                              const ctx = canvas.getContext('2d')
                              if (ctx) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height)
                              }
                              console.log('⚠️ Rectangle selection too small, cleared')
                            }
                          }
                          setIsSelecting(false)
                          setSelectionStart(null)
                        } else if (selectionMode === 'lasso' && isDrawingLasso) {
                          // Complete smooth lasso selection
                          setIsDrawingLasso(false)

                          if (lassoPoints.length > 10) { // Need enough points for a meaningful selection
                            const ctx = canvasRef.current?.getContext('2d')
                            if (ctx) {
                              ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
                              drawLassoSelection(ctx, lassoPoints, true) // true = complete selection
                            }
                            generateMask()
                          } else {
                            // Not enough points, clear the selection
                            setLassoPoints([])
                          }
                        }
                      }}
                      // Touch events for mobile support
                      onTouchStart={(e) => {
                        e.preventDefault()
                        const touch = e.touches[0]
                        const canvas = canvasRef.current
                        if (canvas && touch) {
                          const rect = canvas.getBoundingClientRect()
                          const scaleX = canvas.width / rect.width
                          const scaleY = canvas.height / rect.height
                          const x = (touch.clientX - rect.left) * scaleX
                          const y = (touch.clientY - rect.top) * scaleY

                          setIsDrawing(true)
                          setLastPosition({ x, y })

                          const ctx = canvas.getContext('2d')
                          if (ctx) {
                            drawPoint(ctx, x, y)
                          }
                        }
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault()
                        if (!isDrawing) return

                        const touch = e.touches[0]
                        const canvas = canvasRef.current
                        if (canvas && touch) {
                          const rect = canvas.getBoundingClientRect()
                          const scaleX = canvas.width / rect.width
                          const scaleY = canvas.height / rect.height
                          const x = (touch.clientX - rect.left) * scaleX
                          const y = (touch.clientY - rect.top) * scaleY

                          const ctx = canvas.getContext('2d')
                          if (ctx) {
                            if (lastPosition) {
                              drawLine(ctx, lastPosition.x, lastPosition.y, x, y)
                            } else {
                              drawPoint(ctx, x, y)
                            }
                            setLastPosition({ x, y })
                          }
                        }
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault()
                        setIsDrawing(false)
                        setLastPosition(null)
                        generateMask()
                      }}
                    />

                    {/* Custom Cursor */}
                    {showCursor && (
                      <div
                        className="absolute pointer-events-none z-10"
                        style={{
                          left: cursorPosition.x - brushSize,
                          top: cursorPosition.y - brushSize,
                          width: brushSize * 2,
                          height: brushSize * 2,
                        }}
                      >
                        <div
                          className={`w-full h-full rounded-full border-2 ${
                            isErasing
                              ? 'border-red-400 bg-red-400/20'
                              : 'border-cyan-400 bg-cyan-400/20'
                          }`}
                          style={{
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                          }}
                        />
                        {/* Center dot */}
                        <div
                          className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                            isErasing ? 'bg-red-400' : 'bg-cyan-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Controls & Settings */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6C3BFF]" />
                Inpainting Prompt
              </h3>
              <textarea
                value={settings.prompt}
                onChange={(e) => setSettings(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Describe what you want to generate in the masked area..."
                className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-[#6C3BFF] transition-colors"
              />
              <div className="text-xs text-gray-400 mt-2">
                {settings.prompt.length}/500 characters
              </div>
            </div>

            {/* Quick Settings */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#6C3BFF]" />
                Quick Settings
              </h3>

              {/* API Mode Toggle */}
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">
                      Use Finetune API
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      {settings.use_finetune
                        ? "Using custom finetune model (requires finetune ID)"
                        : "Using regular FLUX Fill model (no finetune needed)"
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newUseFinetune = !settings.use_finetune
                      setSettings(prev => ({
                        ...prev,
                        use_finetune: newUseFinetune,
                        guidance: newUseFinetune ? 60 : 50.75 // Adjust default guidance
                      }))
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.use_finetune ? 'bg-[#6C3BFF]' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.use_finetune ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Finetune Strength - Only show when finetune is enabled */}
                {settings.use_finetune && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Finetune Strength: {settings.finetune_strength}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.finetune_strength}
                      onChange={(e) => setSettings(prev => ({ ...prev, finetune_strength: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Steps: {settings.steps}
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={settings.steps}
                    onChange={(e) => setSettings(prev => ({ ...prev, steps: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Guidance: {settings.guidance}
                  </label>
                  <input
                    type="range"
                    min="1.5"
                    max="100"
                    step="0.5"
                    value={settings.guidance}
                    onChange={(e) => setSettings(prev => ({ ...prev, guidance: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <HoverBorderGradient
              onClick={!originalImage || !maskImage || !settings.prompt.trim() || isGenerating ? undefined : handleGenerate}
              backgroundColor="bg-[#006aff]"
              className="w-full py-4 font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {generationStatus || 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Inpainting
                </>
              )}
            </HoverBorderGradient>

            {/* Mask Preview */}
            {maskImage && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Mask Preview</h3>
                <div className="relative">
                  <Image
                    src={maskImage}
                    alt="Mask"
                    width={400}
                    height={300}
                    className="w-full rounded-lg bg-gray-900"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    White areas will be inpainted, black areas will be preserved
                  </p>
                  <div className="mt-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      maskImage ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {maskImage ? '✅ Mask Ready' : '❌ No Mask'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {resultImage && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
                <div className="relative">
                  <Image
                    src={resultImage}
                    alt="Result"
                    width={400}
                    height={300}
                    className="w-full rounded-lg cursor-pointer"
                    onClick={() => {
                      setFullscreenImage(resultImage)
                      setShowFullscreen(true)
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => {
                        setFullscreenImage(resultImage)
                        setShowFullscreen(true)
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                      title="View Fullscreen"
                    >
                      <Maximize className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => showDownloadOptionsModal(resultImage, 'inpainted-result.jpg')}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                      title="Download Result"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Settings Panel */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Advanced Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Finetune ID - Only show when finetune is enabled */}
                {settings.use_finetune && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Finetune ID
                    </label>
                    <input
                      type="text"
                      value={settings.finetune_id}
                      onChange={(e) => setSettings(prev => ({ ...prev, finetune_id: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6C3BFF]"
                      placeholder="my-finetune"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Enter your custom finetune ID. Use &quot;my-finetune&quot; as default.
                    </p>
                  </div>
                )}

                {/* Seed */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seed (Optional)
                  </label>
                  <input
                    type="number"
                    value={settings.seed || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, seed: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6C3BFF]"
                    placeholder="Random"
                  />
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Output Format
                  </label>
                  <select
                    value={settings.output_format}
                    onChange={(e) => setSettings(prev => ({ ...prev, output_format: e.target.value as 'jpeg' | 'png' }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6C3BFF]"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>

                {/* Safety Tolerance */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Safety Tolerance: {settings.safety_tolerance}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={settings.safety_tolerance}
                    onChange={(e) => setSettings(prev => ({ ...prev, safety_tolerance: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Most Strict</span>
                    <span>Least Strict</span>
                  </div>
                </div>

                {/* Prompt Upsampling */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    Prompt Upsampling
                  </label>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, prompt_upsampling: !prev.prompt_upsampling }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.prompt_upsampling ? 'bg-[#6C3BFF]' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.prompt_upsampling ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Reset to Defaults */}
                <button
                  onClick={() => setSettings({
                    use_finetune: false,
                    finetune_id: 'my-finetune',
                    finetune_strength: 1.1,
                    prompt: settings.prompt, // Keep the prompt
                    steps: 50,
                    prompt_upsampling: false,
                    seed: null,
                    guidance: 50.75,
                    output_format: 'jpeg',
                    safety_tolerance: 2
                  })}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Modal */}
        {showFullscreen && fullscreenImage && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={fullscreenImage}
                alt="Fullscreen"
                width={1920}
                height={1080}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ maxWidth: '95vw', maxHeight: '95vh' }}
                unoptimized
              />

              {/* Close button */}
              <button
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Download button */}
              <button
                onClick={() => {
                  const filename = fullscreenImage === originalImage ? 'original-image.jpg' : 
                                 fullscreenImage === resultImage ? 'inpainted-result.jpg' : 'image.jpg'
                  showDownloadOptionsModal(fullscreenImage, filename)
                }}
                className="absolute top-4 left-4 p-3 bg-black/70 hover:bg-black/90 rounded-full transition-colors backdrop-blur-sm"
              >
                <Download className="w-6 h-6 text-white" />
              </button>

              {/* ESC key hint */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
                Press ESC or click outside to close
              </div>
            </div>

            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setShowFullscreen(false)}
            />
          </div>
        )}

        {/* Download Options Modal */}
        {showDownloadOptions && pendingDownload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Download Options</h3>
                <p className="text-gray-400 text-sm">Choose how you&apos;d like to download the image</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleDownloadChoice(false)}
                  className="w-full py-3 bg-[#6C3BFF] hover:bg-[#5A2FE8] text-white rounded-lg transition-colors font-medium"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Directly
                </button>

                <button
                  onClick={() => handleDownloadChoice(true)}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Maximize className="w-4 h-4 inline mr-2" />
                  Open in New Tab
                  <span className="block text-xs text-gray-400 mt-1">(State will be saved)</span>
                </button>

                <button
                  onClick={() => {
                    setShowDownloadOptions(false)
                    setPendingDownload(null)
                  }}
                  className="w-full py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}