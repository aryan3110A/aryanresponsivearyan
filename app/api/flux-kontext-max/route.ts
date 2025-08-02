import { NextRequest, NextResponse } from 'next/server'
import { downloadAndStoreImage, generateImageFileName } from '@/lib/firebaseStorage'

// Add interface at the top of the file
// interface FluxKontextMaxRequestBody {
//   prompt: string;
//   output_format: string;
//   prompt_upsampling: boolean;
//   safety_tolerance: number;
//   input_image?: string;
//   seed?: number;
//   aspect_ratio?: string;
//   webhook_url?: string;
//   webhook_secret?: string;
// }

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Flux Kontext Max API is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Flux Kontext Max API called')
    
    // Check if API key is available
    const apiKey = process.env.FLUX_API_KEY
    if (!apiKey) {
      console.error('❌ FLUX_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'Flux API key not configured. Please set FLUX_API_KEY environment variable in Vercel deployment.' },
        { status: 500 }
      )
    }
    
    const body = await request.json()
    console.log('📝 Request body received:', {
      hasPrompt: !!body.prompt,
      hasInputImage: !!body.input_image,
      aspectRatio: body.aspect_ratio
    })
    
    const {
      prompt,
      input_image,
      seed,
      aspect_ratio,
      output_format = 'png',
      webhook_url,
      webhook_secret,
      prompt_upsampling = false,
      
      safety_tolerance = 2
    } = body

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate safety tolerance range
    if (safety_tolerance < 0 || safety_tolerance > 6) {
      return NextResponse.json(
        { error: 'Safety tolerance must be between 0 and 6' },
        { status: 400 }
      )
    }

    // Validate aspect ratio format for Flux API
    if (aspect_ratio) {
      const aspectRatioRegex = /^\d+:\d+$/
      if (!aspectRatioRegex.test(aspect_ratio)) {
        return NextResponse.json(
          { error: 'Invalid aspect ratio format. Must be in format "width:height"' },
          { status: 400 }
        )
      }
      
      const [width, height] = aspect_ratio.split(':').map(Number)
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        return NextResponse.json(
          { error: 'Invalid aspect ratio values. Width and height must be positive numbers' },
          { status: 400 }
        )
      }
      
      // Check if aspect ratio is within Flux API limits (between 21:9 and 9:21)
      const ratio = width / height
      if (ratio < 9/21 || ratio > 21/9) {
        console.warn(`⚠️ Aspect ratio ${aspect_ratio} is outside Flux API recommended range (21:9 to 9:21). Using anyway.`)
      }
    }

    // Prepare request body for BFL API
    const requestBody: {
      prompt: string
      output_format: string
      prompt_upsampling: boolean
      safety_tolerance: number
      input_image?: string
      seed?: number
      aspect_ratio?: string
      webhook_url?: string
      webhook_secret?: string
    } = {
      prompt,
      output_format,
      prompt_upsampling,
      safety_tolerance
    }

    // Add optional fields
    if (input_image) {
      requestBody.input_image = input_image
    }

    if (seed) {
      requestBody.seed = seed
    }

    if (aspect_ratio) {
      requestBody.aspect_ratio = aspect_ratio
    }

    if (webhook_url) {
      requestBody.webhook_url = webhook_url
    }

    if (webhook_secret) {
      requestBody.webhook_secret = webhook_secret
    }

    console.log('🚀 Calling Flux Kontext Max API:', {
      prompt: prompt.substring(0, 100) + '...',
      hasInputImage: !!input_image,
      aspectRatio: aspect_ratio,
      seed,
      promptUpsampling: prompt_upsampling,
      safetyTolerance: safety_tolerance,
      modelId: 6
    })

    // Call BFL API
    const bflResponse = await fetch('https://api.bfl.ai/v1/flux-kontext-max', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': process.env.FLUX_API_KEY!,
      },
      body: JSON.stringify(requestBody),
    })
    // hello

    if (!bflResponse.ok) {
      const errorData = await bflResponse.text()
      console.error('BFL API Error:', bflResponse.status, errorData)

      return NextResponse.json(
        { error: `BFL API error: ${bflResponse.status} - ${errorData}` },
        { status: bflResponse.status }
      )
    }

    const data: { id?: string; polling_url?: string; image_urls?: string[]; error?: string } = await bflResponse.json()
    console.log('✅ BFL API Response:', { id: data.id, polling_url: data.polling_url })

    if (!data.polling_url) {
      throw new Error('No polling URL received from BFL API')
    }
    const pollingUrl = data.polling_url

    // Start polling for result
    const pollResult = await pollForResult(pollingUrl)

    if (pollResult.error) {
      return NextResponse.json(
        { error: pollResult.error },
        { status: 500 }
      )
    }

    // Store image in Firebase Storage for permanent access
    let permanentImageUrl = null
    let storagePath = null
    let storageError = null
    const originalImageUrl = pollResult.result?.sample || null

    if (originalImageUrl) {
      console.log('💾 Storing image in Firebase Storage...')
      const fileName = generateImageFileName(requestBody.prompt, 'flux-kontext-max')
      try {
        const storageResult = await downloadAndStoreImage(originalImageUrl, fileName)

        if (storageResult.success) {
          permanentImageUrl = storageResult.url!
          storagePath = storageResult.path
          console.log('✅ Image stored permanently in Firebase:', permanentImageUrl)
        } else {
          console.error('❌ Failed to store image in Firebase:', storageResult.error)
          storageError = storageResult.error
          console.log('⚠️ Using image proxy for BFL URL to avoid CORS issues')
          // Use image proxy to avoid CORS issues
          const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(originalImageUrl)}`
          permanentImageUrl = proxyUrl
        }
      } catch (error: unknown) {
        console.error('❌ Error during upload:', error)
        // Use image proxy as fallback
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(originalImageUrl)}`
        permanentImageUrl = proxyUrl
      }
    } else {
      return NextResponse.json(
        { error: 'No image generated by BFL API' },
        { status: 500 }
      )
    }

    // Return structured JSON response
    const responseData = {
      success: true,
      id: data.id,
      polling_url: data.polling_url,
      result: {
        sample: permanentImageUrl  // Firebase Storage URL or fallback
      },
      imageUrl: permanentImageUrl,  // Primary image URL
      originalImageUrl: originalImageUrl,  // Original BFL URL (for reference)
      storagePath,
      timestamp: new Date().toISOString(),
      // Add metadata for better error handling
      metadata: {
        model: 'flux-kontext-max',
        modelId: 6,
        prompt: requestBody.prompt.substring(0, 100),
        aspectRatio: requestBody.aspect_ratio,
        hasInputImage: !!requestBody.input_image,
        storedInFirebase: !!storagePath,  // True only if Firebase Storage succeeded
        isTemporaryUrl: !storagePath,     // Warning flag for temporary URLs
        storageError: storageError
      }
    }

    console.log('✅ Returning successful response:', {
      id: responseData.id,
      hasImageUrl: !!responseData.imageUrl,
      imageUrl: responseData.imageUrl,
      originalImageUrl: responseData.originalImageUrl
    })

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Flux Kontext Max API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Polling function to get the result
async function pollForResult(pollingUrl: string, maxAttempts = 30, interval = 2000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`📊 Polling attempt ${attempt + 1}/${maxAttempts}`)
      
      const response = await fetch(pollingUrl, {
        headers: {
          'x-key': process.env.FLUX_API_KEY!,
        },
      })

      if (!response.ok) {
        console.error('Polling error:', response.status)
        continue
      }

      const data: { status: string; result?: { sample?: string; error?: string } } = await response.json()
      console.log('📊 Polling status:', data.status)

      if (data.status === 'Ready') {
        console.log('✅ Generation complete!')
        return { result: data.result }
      }

      if (data.status === 'Error' || data.status === 'Request Moderated') {
        console.error('❌ Generation failed:', data.status)
        return { error: `Generation failed: ${data.status}` }
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval))

    } catch (error) {
      console.error('Polling attempt failed:', error)
      
      // If it's the last attempt, return error
      if (attempt === maxAttempts - 1) {
        return { error: 'Polling failed after maximum attempts' }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }

  return { error: 'Generation timed out' }
}
