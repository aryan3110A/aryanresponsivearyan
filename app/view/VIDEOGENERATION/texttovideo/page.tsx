"use client"

import { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import Image from 'next/image'
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import { CAMERA_MOVEMENTS, CameraMovement, getModelType, getApiModelName, supportsCameraMovements, supportsSubjectReference, getApiResolution } from "./componennts/videoModels"

export default function NewTextToVideo() {
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("MiniMax-Hailuo-02")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9")
  const [selectedQuality, setSelectedQuality] = useState("HD")
  const [selectedDuration, setSelectedDuration] = useState(6)
  const [selectedCameraMovements, setSelectedCameraMovements] = useState<string[]>([])
  const [firstFrameImage, setFirstFrameImage] = useState<string | null>(null)
  const [subjectImage, setSubjectImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Model-specific validation based on MiniMax API requirements
    const modelType = getModelType(selectedModel)

    // I2V models require first_frame_image
    if ((selectedModel === 'I2V-01-Director' || selectedModel === 'I2V-01' || selectedModel === 'I2V-01-live') && !firstFrameImage) {
      alert('Please upload a first frame image for image-to-video generation')
      return
    }

    // S2V-01 requires subject_reference
    if (selectedModel === 'S2V-01' && !subjectImage) {
      console.log('S2V-01 validation failed - subjectImage:', subjectImage)
      console.log('firstFrameImage:', firstFrameImage)
      alert('S2V-01 model requires a subject reference image. Please upload an image using the attachment button and try again.')
      return
    }

    setIsGenerating(true)

    try {
      // Build the final prompt with camera movements for Director models
      let finalPrompt = prompt
      if (selectedCameraMovements.length > 0 && supportsCameraMovements(selectedModel)) {
        const cameraInstructions = selectedCameraMovements.map(movementId => {
          const movement = CAMERA_MOVEMENTS.find((m: CameraMovement) => m.id === movementId)
          return movement?.instruction
        }).filter(Boolean).join(', ')

        if (cameraInstructions) {
          finalPrompt = `${prompt} ${cameraInstructions}`
        }
      }

      // Prepare API payload based on model type and MiniMax API specifications
      const apiModel = getApiModelName(selectedModel)
      const apiResolution = getApiResolution(selectedModel, selectedQuality, selectedAspectRatio)

      // Base payload according to MiniMax API
      const basePayload = {
        model: apiModel,
        prompt: finalPrompt,
        duration: selectedDuration,
        resolution: apiResolution,
        prompt_optimizer: true, // Enable prompt optimization by default
        aspect_ratio: selectedAspectRatio // Most models support aspect_ratio
      }

      // Add model-specific parameters according to MiniMax API documentation
      const apiPayload: Record<string, unknown> = { ...basePayload }

      // For I2V models (Image-to-Video), add first_frame_image
      if (modelType === 'image-to-video' && firstFrameImage) {
        apiPayload.first_frame_image = firstFrameImage
      }
      // For MiniMax-Hailuo-02, first_frame_image is optional
      else if (selectedModel === 'MiniMax-Hailuo-02' && firstFrameImage) {
        apiPayload.first_frame_image = firstFrameImage
      }

      // For S2V-01 model, add subject_reference array (required)
      console.log('Checking S2V-01 conditions:')
      console.log('- supportsSubjectReference(selectedModel):', supportsSubjectReference(selectedModel))
      console.log('- selectedModel === "S2V-01":', selectedModel === 'S2V-01')
      console.log('- subjectImage exists:', !!subjectImage)
      console.log('- subjectImage length:', subjectImage?.length || 0)

      // Special handling for S2V-01 - check both subjectImage and firstFrameImage
      if (selectedModel === 'S2V-01') {
        console.log('=== S2V-01 IMAGE CHECK ===')
        console.log('subjectImage exists:', !!subjectImage)
        console.log('subjectImage length:', subjectImage?.length || 0)
        console.log('firstFrameImage exists:', !!firstFrameImage)
        console.log('firstFrameImage length:', firstFrameImage?.length || 0)

        // Use subjectImage if available, otherwise use firstFrameImage
        const imageToUse = subjectImage || firstFrameImage

        if (!imageToUse) {
          console.log('❌ ERROR: No image available for S2V-01')
          alert('S2V-01 model requires a subject reference image. Please upload an image using the attachment button and try again.')
          return
        }

        console.log('Using image source:', subjectImage ? 'subjectImage' : 'firstFrameImage')
        console.log('Image preview:', imageToUse.substring(0, 50) + '...')

        // Ensure the image has proper data URL format
        if (!imageToUse.startsWith('data:image/')) {
          console.log('❌ ERROR: Image data does not start with data:image/')
          console.log('Image data preview:', imageToUse.substring(0, 100))
          alert('Invalid image format. Please upload a valid image file.')
          return
        }

        // Validate image data length
        if (imageToUse.length < 1000) {
          console.log('❌ ERROR: Image data too short:', imageToUse.length)
          alert('Image data appears to be corrupted. Please try uploading again.')
          return
        }

        const subjectRefArray = [
          {
            type: "character",
            image: [imageToUse]
          }
        ]

        apiPayload.subject_reference = subjectRefArray

        console.log('✅ Subject reference created:', {
          array_length: subjectRefArray.length,
          has_type: !!subjectRefArray[0].type,
          type_value: subjectRefArray[0].type,
          has_image_array: Array.isArray(subjectRefArray[0].image),
          image_array_length: subjectRefArray[0].image.length,
          first_image_length: subjectRefArray[0].image[0]?.length || 0
        })

        // Remove aspect_ratio for S2V-01 as it's not in the API docs
        delete apiPayload.aspect_ratio
        console.log('========================')
      }

      // Debug logging
      console.log('=== GENERATION DEBUG ===')
      console.log('Selected Model:', selectedModel)
      console.log('Model Type:', modelType)
      console.log('Supports Subject Reference:', supportsSubjectReference(selectedModel))
      console.log('Subject Image Present:', !!subjectImage)
      console.log('First Frame Image Present:', !!firstFrameImage)
      console.log('Subject Image Length:', subjectImage?.length || 0)
      console.log('First Frame Image Length:', firstFrameImage?.length || 0)
      // Log payload structure without full base64 data
      console.log('Final API Payload structure:')
      console.log('- model:', apiPayload.model)
      console.log('- prompt:', apiPayload.prompt)
      console.log('- duration:', apiPayload.duration)
      console.log('- resolution:', apiPayload.resolution)
      console.log('- has subject_reference:', !!apiPayload.subject_reference)
      console.log('- has first_frame_image:', !!apiPayload.first_frame_image)
      if (apiPayload.subject_reference) {
        const subjectRefArray = apiPayload.subject_reference as Array<{image: string}>
        console.log('- subject_reference array length:', subjectRefArray.length)
        console.log('- first subject_reference has image:', !!subjectRefArray[0]?.image)
        console.log('- first subject_reference image length:', subjectRefArray[0]?.image?.length || 0)
      }
      console.log('========================')

      // Call the API for video generation
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await response.json()

      if (data.success && data.video_urls && data.video_urls.length > 0) {
        setGeneratedImages(data.video_urls)
      } else {
        throw new Error(data.error || 'No video URLs in response')
      }
    } catch (error) {
      console.error('Video generation failed:', error)
      // Show error to user
      alert(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // Fallback to placeholder video for demo
      const placeholderVideo = ["/placeholder-video.mp4"]
      setGeneratedImages(placeholderVideo)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  return (
    <>
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/newt2image/bg.png" alt="background" width={1920} height={1080} className="w-auto h-auto  md:-mt-48  object-contain " />
      </div>
      <NavigationFull />
      {/* <BackgroundShapes /> */}

      <div className="relative z-10">
        <Header title="Text to VIDEO Generator" />

        {/* Debug Info - Remove in production */}
        <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>Model: {selectedModel}</div>
          <div>Type: {getModelType(selectedModel)}</div>
          <div>FirstFrame: {firstFrameImage ? '✅' : '❌'}</div>
          <div>Subject: {subjectImage ? '✅' : '❌'}</div>
          <div>Supports Subject Ref: {supportsSubjectReference(selectedModel) ? '✅' : '❌'}</div>
        </div>

        <main className="container mx-auto  lg:px-8 xl:px-12 2xl:px-16">
          <InputSection
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            onSettingsToggle={handleSettingsToggle}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            selectedModel={selectedModel}
            selectedStyle={null}
            selectedQuality={selectedQuality}
            selectedAspectRatio={selectedAspectRatio}
            numberOfImages={1}
            firstFrameImage={firstFrameImage}
            setFirstFrameImage={setFirstFrameImage}
            subjectImage={subjectImage}
            setSubjectImage={setSubjectImage}
          />
        </main>

        
      </div>
      

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedAspectRatio={selectedAspectRatio}
        setSelectedAspectRatio={setSelectedAspectRatio}
        selectedQuality={selectedQuality}
        setSelectedQuality={setSelectedQuality}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        selectedCameraMovements={selectedCameraMovements}
        setSelectedCameraMovements={setSelectedCameraMovements}
        firstFrameImage={firstFrameImage}
        setFirstFrameImage={setFirstFrameImage}
        subjectImage={subjectImage}
        setSubjectImage={setSubjectImage}
      />
      
    </div>
    <Footer />
    </>
  )
}
