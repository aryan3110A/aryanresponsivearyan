import { NextRequest, NextResponse } from 'next/server'

const MINIMAX_API_BASE = 'https://api.minimax.io/v1'
const API_KEY = process.env.NEXT_PUBLIC_MINMAX_API_KEY



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

  // For T2V-01-Director model, only use 768P (doesn't support 1080P)
  if (model === "T2V-01-Director") {
    return "768P"
  }

  // For I2V-01-Director model, only use 768P (doesn't support 1080P)
  if (model === "I2V-01-Director") {
    return "768P"
  }

  // For other models, use 768P or 1080P as fallback
  if (quality === "FullHD" || quality === "2K" || quality === "Full HD") {
    return "1080P"
  }
  return "768P"
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
      has_subject_reference: !!subject_reference
    })

    // Step 1: Create video generation task
    const payload: any = {
      model: VIDEO_MODELS[model as keyof typeof VIDEO_MODELS] || "MiniMax-Hailuo-02",
      prompt: prompt,
      duration: duration,
      resolution: resolution,
      prompt_optimizer: true
    }

    // Add aspect_ratio for most models (except S2V-01)
    if (selectedAspectRatio && model !== "S2V-01") {
      payload.aspect_ratio = selectedAspectRatio
    }

    // Add first frame image if provided (for I2V models)
    if (first_frame_image && (model.includes("I2V") || model === "MiniMax-Hailuo-02")) {
      payload.first_frame_image = first_frame_image
    }

    // Add subject reference if provided (for S2V-01 model)
    if (subject_reference && model === "S2V-01") {
      payload.subject_reference = subject_reference
    }

    console.log('Sending request to MiniMax API:', {
      url: `${MINIMAX_API_BASE}/video_generation`,
      payload: { ...payload, prompt: payload.prompt.substring(0, 100) + '...' }
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

    let taskResponse
    try {
      taskResponse = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse response:', parseError)
      throw new Error('Invalid JSON response from MiniMax API')
    }

    const taskId = taskResponse.task_id

    if (!taskId) {
      console.error('Full API response:', taskResponse)
      throw new Error(`No task ID received from MiniMax API. Response: ${JSON.stringify(taskResponse)}`)
    }

    console.log('Task created with ID:', taskId)

    // Return task ID immediately to avoid timeout
    return NextResponse.json({
      success: true,
      task_id: taskId,
      message: 'Video generation task submitted successfully. Use the task_id to poll for status.',
      next_step: 'Call /api/query-video-status with the task_id to check progress'
    })

  } catch (error: unknown) {
    console.error('Video generation failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed'
    }, { status: 500 })
  }
}
