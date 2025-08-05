"use client"

import React, { useState } from "react"
import { Header } from "../UI"
import InputSection from "./componennts/InputSection"
import SettingsPanel from "./componennts/SettingsPanel"
// import BackgroundShapes from "./componennts/BackgroundShapes"
import NavigationFull from "../../Core/NavigationFull"
import Footer from "../../Core/Footer"
import StableBackground from "../../Core/StableBackground"
import { CAMERA_MOVEMENTS, CameraMovement, getModelType, getApiModelName, supportsCameraMovements, getApiResolution } from "./componennts/videoModels"

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
      if (selectedModel === 'S2V-01') {
        const imageToUse = subjectImage || firstFrameImage

        if (!imageToUse) {
          console.log('❌ ERROR: No image available for S2V-01')
          alert('S2V-01 model requires a subject reference image. Please upload an image using the attachment button and try again.')
          return
        }

        const subjectRefArray = [
          {
            type: "character",
            image: [imageToUse]
          }
        ]

        apiPayload.subject_reference = subjectRefArray
        delete apiPayload.aspect_ratio
      }

      console.log('=== STEP 1: Creating video generation task ===')
      
      // Step 1: Create video generation task
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create video generation task')
      }

      const taskData = await response.json()
      
      if (!taskData.success || !taskData.task_id) {
        throw new Error(taskData.error || 'No task ID received')
      }

      console.log('✅ Task created with ID:', taskData.task_id)

      // Step 2: Poll for task completion
      console.log('=== STEP 2: Polling for task completion ===')
      const maxAttempts = 60 // 5 minutes with 5-second intervals
      let attempts = 0
      let taskStatus = 'Queueing'
      let fileId = null

      while (attempts < maxAttempts && !['Success', 'Fail'].includes(taskStatus)) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
        
        try {
          const statusResponse = await fetch('/api/query-video-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_id: taskData.task_id }),
          })

          if (!statusResponse.ok) {
            console.log(`Status check failed, attempt ${attempts + 1}/${maxAttempts}`)
            attempts++
            continue
          }

          const statusData = await statusResponse.json()
          taskStatus = statusData.status
          fileId = statusData.file_id

          console.log(`Task ${taskData.task_id} status: ${taskStatus}`)
          
          if (taskStatus === 'Success') {
            console.log('✅ Video generation completed!')
            break
          } else if (taskStatus === 'Fail') {
            throw new Error('Video generation failed')
          }
        } catch (statusError) {
          console.log(`Status check error, attempt ${attempts + 1}/${maxAttempts}:`, statusError)
        }
        
        attempts++
      }

      if (taskStatus !== 'Success' || !fileId) {
        throw new Error('Video generation timed out or failed')
      }

      console.log('✅ Video generation completed, file ID:', fileId)

      // Step 3: Download the video
      console.log('=== STEP 3: Downloading video ===')
      const downloadResponse = await fetch('/api/download-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId }),
      })

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to download video')
      }

      const downloadData = await downloadResponse.json()

      if (downloadData.success && downloadData.video_urls && downloadData.video_urls.length > 0) {
        setGeneratedImages(downloadData.video_urls)
        console.log('✅ Video downloaded successfully:', downloadData.video_urls)
      } else {
        throw new Error(downloadData.error || 'No video URLs in response')
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
      {/* Background Particles */}
      <StableBackground />
      <NavigationFull />
      {/* <BackgroundShapes /> */}

      <div className="relative z-10">
        <Header title="Image To Video" />

        {/* Debug Info - Remove in production */}
        {/* <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
          <div className="font-bold mb-2">Debug Info:</div>
          <div>Model: {selectedModel}</div>
          <div>Type: {getModelType(selectedModel)}</div>
          <div>FirstFrame: {firstFrameImage ? '✅' : '❌'}</div>
          <div>Subject: {subjectImage ? '✅' : '❌'}</div>
          <div>Supports Subject Ref: {supportsSubjectReference(selectedModel) ? '✅' : '❌'}</div>
        </div> */}

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
