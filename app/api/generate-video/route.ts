import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MINIMAX_API_BASE = 'https://api.minimax.io/v1'
const API_KEY = process.env.NEXT_PUBLIC_MINMAX_API_KEY

// Helper function to extract GroupId from JWT token
function extractGroupIdFromToken(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    console.log('JWT payload:', payload)
    const groupId = payload.GroupID || 'default_group'
    console.log('Extracted GroupID:', groupId)
    return groupId
  } catch (error) {
    console.error('Error extracting GroupId from token:', error)
    return 'default_group'
  }
}

// MiniMax video generation models
const VIDEO_MODELS = {
  "MiniMax-Hailuo-02": "MiniMax-Hailuo-02",
  "T2V-01-Director": "T2V-01-Director", 
  "I2V-01-Director": "I2V-01-Director",
  "S2V-01": "S2V-01"
}

// Helper function to map aspect ratio to resolution
function getResolutionFromAspectRatio(aspectRatio: string, quality: string, model: string): string {
  // For MiniMax-Hailuo-02, use 768P or 1080P
  if (model === "MiniMax-Hailuo-02") {
    if (quality === "FullHD" || quality === "2K") {
      return "1080P"
    }
    return "768P"
  }

  // For S2V-01, use 768P or 1080P (same as MiniMax-Hailuo-02)
  if (model === "S2V-01") {
    if (quality === "FullHD" || quality === "2K" || quality === "Full HD") {
      return "1080P"
    }
    return "768P"
  }

  // For other models (T2V-01, I2V-01 series), use 720P
  return "720P"
}

// Helper function to create video generation task
async function createVideoTask(prompt: string, model: string, resolution: string, duration: number = 6, firstFrameImage?: string, subjectReference?: Array<{ type: string; image: string[] }>, aspectRatio?: string) {
  const payload: {
    model: string
    prompt: string
    duration: number
    resolution: string
    prompt_optimizer: boolean
    aspect_ratio?: string
    first_frame_image?: string
    subject_reference?: Array<{ type: string; image: string[] }>
  } = {
    model: VIDEO_MODELS[model as keyof typeof VIDEO_MODELS] || "MiniMax-Hailuo-02",
    prompt: prompt,
    duration: duration,
    resolution: resolution,
    prompt_optimizer: true
  }

  // Add aspect_ratio for most models (except S2V-01 which might not support it)
  if (aspectRatio && model !== "S2V-01") {
    payload.aspect_ratio = aspectRatio
  }

  // Add first frame image if provided (for I2V models)
  if (firstFrameImage && (model.includes("I2V") || model === "MiniMax-Hailuo-02")) {
    payload.first_frame_image = firstFrameImage
  }

  // Add subject reference if provided (for S2V-01 model)
  if (subjectReference && model === "S2V-01") {
    console.log('Adding subject_reference for S2V-01:')
    console.log('- subjectReference type:', typeof subjectReference)
    console.log('- subjectReference is array:', Array.isArray(subjectReference))
    console.log('- subjectReference length:', subjectReference.length)
    console.log('- first item structure:', Object.keys(subjectReference[0] || {}))
    console.log('- first item has type:', !!subjectReference[0]?.type)
    console.log('- type value:', subjectReference[0]?.type)
    console.log('- first item has image:', !!subjectReference[0]?.image)
    console.log('- image is array:', Array.isArray(subjectReference[0]?.image))
    console.log('- image array length:', subjectReference[0]?.image?.length || 0)

    // Check the actual image data
    const imageArray = subjectReference[0]?.image
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      console.log('- first image data length:', imageArray[0]?.length || 0)
      console.log('- first image preview:', imageArray[0]?.substring(0, 50) + '...')

      // Validate image format
      if (imageArray[0] && !imageArray[0].startsWith('data:image/')) {
        console.log('❌ WARNING: Image does not start with data:image/')
      }
    } else {
      console.log('❌ WARNING: Image array is empty or not an array')
    }

    payload.subject_reference = subjectReference

    console.log('Final S2V-01 payload structure:')
    console.log('- model:', payload.model)
    console.log('- prompt:', payload.prompt)
    console.log('- duration:', payload.duration)
    console.log('- resolution:', payload.resolution)
    console.log('- prompt_optimizer:', payload.prompt_optimizer)
    console.log('- has aspect_ratio:', !!payload.aspect_ratio)
    console.log('- subject_reference array length:', payload.subject_reference.length)
  }

  console.log('Sending request to MiniMax API:', {
    url: `${MINIMAX_API_BASE}/video_generation`,
    payload,
    headers: {
      'Authorization': `Bearer ${API_KEY?.substring(0, 20)}...`,
      'Content-Type': 'application/json',
    }
  })

  const response = await fetch(`${MINIMAX_API_BASE}/video_generation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await response.text()
  console.log('MiniMax API raw response:', responseText)

  if (!response.ok) {
    console.error('MiniMax API error:', response.status, responseText)
    let error
    try {
      error = JSON.parse(responseText)
    } catch {
      error = { message: responseText }
    }
    throw new Error(error.base_resp?.status_msg || error.message || `HTTP ${response.status}`)
  }

  try {
    return JSON.parse(responseText)
  } catch (parseError) {
    console.error('Failed to parse response:', parseError)
    throw new Error('Invalid JSON response from MiniMax API')
  }
}

// Helper function to query task status
async function queryTaskStatus(taskId: string) {
  const response = await fetch(`${MINIMAX_API_BASE}/query/video_generation?task_id=${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.base_resp?.status_msg || `HTTP ${response.status}`)
  }

  return await response.json()
}

// Helper function to get file download URL
async function getFileDownloadUrl(fileId: string, groupId: string) {
  // Based on MiniMax documentation: GET request to retrieve file
  const url = `${MINIMAX_API_BASE}/files/retrieve?GroupId=${groupId}&file_id=${fileId}`

  console.log('Requesting file download URL:', {
    url,
    fileId,
    groupId
  })

  const response = await fetch(url, {
    method: 'GET', // Documentation example shows GET request
    headers: {
      'authority': 'api.minimax.io', // Exact header from documentation
      'content-type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
  })

  const responseText = await response.text()
  console.log('File retrieval response:', response.status, responseText)

  if (!response.ok) {
    console.error('File retrieval failed:', response.status, responseText)
    let error
    try {
      error = JSON.parse(responseText)
    } catch {
      error = { message: responseText }
    }
    throw new Error(error.base_resp?.status_msg || error.message || `HTTP ${response.status}`)
  }

  try {
    return JSON.parse(responseText)
  } catch (parseError) {
    console.error('Failed to parse file response:', parseError)
    throw new Error('Invalid JSON response from file retrieval API')
  }
}

// Helper function to download and save video to static files
async function downloadAndSaveVideo(downloadUrl: string, filename: string): Promise<string> {
  try {
    console.log('Downloading video from:', downloadUrl)

    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`)
    }

    const contentLength = response.headers.get('content-length')
    console.log('Video content length:', contentLength)

    const buffer = await response.arrayBuffer()
    console.log('Downloaded buffer size:', buffer.byteLength)

    if (buffer.byteLength === 0) {
      throw new Error('Downloaded video file is empty')
    }

    // Create static/videos directory if it doesn't exist
    const videosDir = path.join(process.cwd(), 'public', 'static', 'videos')
    await fs.mkdir(videosDir, { recursive: true })

    // Save video file
    const filePath = path.join(videosDir, filename)
    await fs.writeFile(filePath, Buffer.from(buffer))

    console.log('Video saved to:', filePath, 'Size:', buffer.byteLength, 'bytes')

    // Return the public URL
    return `/static/videos/${filename}`
  } catch (error) {
    console.error('Error saving video:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'MiniMax API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const {
      prompt,
      model = "MiniMax-Hailuo-02",
      selectedAspectRatio = "16:9",
      selectedQuality = "HD",
      duration = 6,
      first_frame_image,
      subject_reference
    } = body

    // Extract GroupId from the JWT token
    const group_id = extractGroupIdFromToken(API_KEY || '')
    console.log('Using GroupId:', group_id)
    

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Get resolution based on aspect ratio and quality
    const resolution = getResolutionFromAspectRatio(selectedAspectRatio, selectedQuality, model)

    console.log('Creating video generation task...', {
      prompt,
      model,
      resolution,
      duration,
      has_first_frame_image: !!first_frame_image,
      has_subject_reference: !!subject_reference,
      subject_reference_length: subject_reference ? subject_reference.length : 0
    })

    // Step 1: Create video generation task
    const taskResponse = await createVideoTask(prompt, model, resolution, duration, first_frame_image, subject_reference, selectedAspectRatio)

    console.log('MiniMax API Response:', taskResponse)

    const taskId = taskResponse.task_id

    if (!taskId) {
      console.error('Full API response:', taskResponse)
      throw new Error(`No task ID received from MiniMax API. Response: ${JSON.stringify(taskResponse)}`)
    }

    console.log('Task created with ID:', taskId)

    // Step 2: Poll for task completion (with timeout)
    const maxAttempts = 60 // 5 minutes with 5-second intervals
    let attempts = 0
    let taskStatus = 'Queueing'
    let fileId = null

    while (attempts < maxAttempts && !['Success', 'Fail'].includes(taskStatus)) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      
      const statusResponse = await queryTaskStatus(taskId)
      taskStatus = statusResponse.status
      fileId = statusResponse.file_id

      console.log(`Task ${taskId} status: ${taskStatus}`)
      if (taskStatus === 'Success') {
        console.log('Full success response:', JSON.stringify(statusResponse, null, 2))
      }
      attempts++
    }

    if (taskStatus === 'Fail') {
      throw new Error('Video generation failed')
    }

    if (taskStatus !== 'Success' || !fileId) {
      throw new Error('Video generation timed out or failed')
    }

    console.log('Video generation completed, file ID:', fileId)

    // Step 3: Get download URL
    try {
      const fileResponse = await getFileDownloadUrl(fileId, group_id)
      const downloadUrl = fileResponse.file?.download_url || fileResponse.file?.backup_download_url

      if (!downloadUrl) {
        throw new Error('No download URL received')
      }

      console.log('Download URL received:', downloadUrl)

      // Step 4: Download and save video to static files
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `video-${taskId}-${timestamp}.mp4`
      const localVideoUrl = await downloadAndSaveVideo(downloadUrl, filename)

      console.log('Video saved locally:', localVideoUrl)

      return NextResponse.json({
        video_urls: [localVideoUrl],
        success: true,
        task_id: taskId,
        file_id: fileId
      })
    } catch (fileError) {
      console.error('File download failed, but video generation succeeded:', fileError)

      // Try alternative approaches to get the video
      const alternativeUrls = [
        `https://api.minimax.io/v1/files/retrieve?GroupId=${group_id}&file_id=${fileId}`,
        `https://api.minimax.io/v1/files/${fileId}?GroupId=${group_id}`,
        `https://files.minimax.io/${group_id}/${fileId}`,
        `https://cdn.minimax.io/files/${fileId}`,
      ]

      // Return success with multiple potential URLs for the user to try
      return NextResponse.json({
        video_urls: alternativeUrls,
        success: true,
        task_id: taskId,
        file_id: fileId,
        group_id: group_id,
        note: 'Video generated successfully! Try the URLs above to access your video. The file retrieval API format needs to be verified.',
        error: fileError instanceof Error ? fileError.message : 'File download failed',
        debug_info: {
          message: 'Video generation completed successfully. The issue is only with automatic file download.',
          suggestion: 'You can contact MiniMax support for the correct file retrieval API format, or access the video through their web interface.'
        }
      })
    }

  } catch (error: unknown) {
    console.error('Video generation failed:', error)
    
    // Return placeholder video for demo/fallback
    const placeholderVideo = ["/placeholder-video.mp4"]
    
    return NextResponse.json({
      video_urls: placeholderVideo,
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed'
    })
  }
}
