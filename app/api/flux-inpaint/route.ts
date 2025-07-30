import { NextRequest, NextResponse } from 'next/server'

interface FluxInpaintRequest {
  use_finetune?: boolean
  finetune_id?: string
  finetune_strength?: number
  image: string // Base64 encoded
  mask: string // Base64 encoded
  prompt: string
  steps: number
  prompt_upsampling: boolean
  seed?: number | null
  guidance: number
  output_format: 'jpeg' | 'png'
  safety_tolerance: number
  webhook_url?: string
  webhook_secret?: string
}

interface FluxInpaintResponse {
  id: string
  polling_url: string
}

interface FluxResultResponse {
  id: string
  status: 'Pending' | 'Ready' | 'Failed'
  result?: {
    sample: string // URL to the generated image
    prompt: string
    seed: number
    start_time: number
    end_time: number
    duration: number
  }
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      use_finetune,
      finetune_id,
      finetune_strength,
      image,
      mask,
      prompt,
      steps,
      prompt_upsampling,
      seed,
      guidance,
      output_format,
      safety_tolerance,
      webhook_url,
      webhook_secret
    } = body

    // Validate required fields
    if (!image || !mask || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: image, mask, or prompt' },
        { status: 400 }
      )
    }

    // Validate finetune fields if using finetune
    if (use_finetune && !finetune_id) {
      return NextResponse.json(
        { error: 'Finetune ID is required when using finetune API' },
        { status: 400 }
      )
    }

    // Validate base64 data doesn't contain data URL prefixes
    if (image.includes('data:') || mask.includes('data:')) {
      console.log('⚠️ Warning: Data URLs detected, will be cleaned')
    }

    // Validate prompt length
    if (prompt.length < 1 || prompt.length > 500) {
      return NextResponse.json(
        { error: 'Prompt must be between 1-500 characters' },
        { status: 400 }
      )
    }

    // Helper function to clean base64 data
    const cleanBase64 = (dataUrl: string): string => {
      if (dataUrl.includes(',')) {
        return dataUrl.split(',')[1]
      }
      return dataUrl
    }

    // Convert base64 data URLs to base64 strings (remove data:image/...;base64, prefix)
    const imageBase64 = cleanBase64(image)
    const maskBase64 = cleanBase64(mask)

    // Debug the conversion
    console.log('🔄 Base64 conversion:', {
      originalImagePrefix: image.substring(0, 50),
      originalMaskPrefix: mask.substring(0, 50),
      cleanImageLength: imageBase64.length,
      cleanMaskLength: maskBase64.length,
      imageHasPrefix: image.includes('data:'),
      maskHasPrefix: mask.includes('data:')
    })

    // Build request object based on API type
    const fluxRequest: FluxInpaintRequest = {
      image: imageBase64,
      mask: maskBase64,
      prompt,
      steps: steps || 50,
      prompt_upsampling: prompt_upsampling || false,
      seed: seed || null,
      guidance: guidance || (use_finetune ? 60 : 50.75),
      output_format: output_format || 'jpeg',
      safety_tolerance: safety_tolerance || 2,
    }

    // Add finetune-specific fields if using finetune
    if (use_finetune) {
      fluxRequest.finetune_id = finetune_id
      fluxRequest.finetune_strength = finetune_strength || 1.1
      if (webhook_url) fluxRequest.webhook_url = webhook_url
      if (webhook_secret) fluxRequest.webhook_secret = webhook_secret
    }

    // Choose endpoint based on API type
    const endpoint = use_finetune
      ? 'https://api.us1.bfl.ai/v1/flux-pro-1.0-fill-finetuned'
      : 'https://api.bfl.ai/v1/flux-pro-1.0-fill'

    console.log('Making request to FLUX API:', {
      endpoint,
      use_finetune,
      ...(use_finetune && {
        finetune_id: fluxRequest.finetune_id,
        finetune_strength: fluxRequest.finetune_strength,
      }),
      prompt: fluxRequest.prompt,
      steps: fluxRequest.steps,
      guidance: fluxRequest.guidance,
      output_format: fluxRequest.output_format
    })

    // Make request to FLUX API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-key': process.env.FLUX_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fluxRequest),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FLUX API error:', response.status, errorText)
      return NextResponse.json(
        { error: `FLUX API error: ${response.status}` },
        { status: response.status }
      )
    }

    const fluxResponse: FluxInpaintResponse = await response.json()
    console.log('FLUX API response:', fluxResponse)

    return NextResponse.json({
      id: fluxResponse.id,
      polling_url: fluxResponse.polling_url,
      message: 'Inpainting task submitted successfully'
    })

  } catch (error) {
    console.error('Inpainting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check task status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Poll the FLUX API for results
    const response = await fetch(`https://api.us1.bfl.ai/v1/get_result?id=${taskId}`, {
      method: 'GET',
      headers: {
        'x-key': process.env.FLUX_API_KEY || '',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FLUX polling error:', response.status, errorText)
      return NextResponse.json(
        { error: `FLUX polling error: ${response.status}` },
        { status: response.status }
      )
    }

    const result: FluxResultResponse = await response.json()

    console.log('FLUX polling result:', {
      id: result.id,
      status: result.status,
      hasResult: !!result.result,
      hasSample: !!result.result?.sample
    })

    return NextResponse.json({
      id: result.id,
      status: result.status,
      result: result.result,
      error: result.error
    })

  } catch (error) {
    console.error('Polling error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
