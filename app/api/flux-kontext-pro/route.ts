import { NextRequest, NextResponse } from 'next/server'

// Add interface at the top of the file
interface FluxKontextProRequestBody {
  prompt: string;
  output_format: string;
  prompt_upsampling: boolean;
  safety_tolerance: number;
  input_image?: string;
  seed?: number;
  aspect_ratio?: string;
  webhook_url?: string;
  webhook_secret?: string;
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Flux Kontext Pro API is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Flux Kontext Pro API called')
    
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
      model_reference_image,
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

    // Determine which image to use as primary input based on shot type
    let primaryInputImage = input_image
    let enhancedPrompt = prompt

    // If model reference is provided, use it for model shots
    if (model_reference_image) {
      // Check if this is a model shot based on prompt content
      const isModelShot = prompt.toLowerCase().includes('model') &&
                         (prompt.toLowerCase().includes('portrait') ||
                          prompt.toLowerCase().includes('wearing') ||
                          prompt.toLowerCase().includes('elegant') ||
                          prompt.toLowerCase().includes('lifestyle'))

      if (isModelShot) {
        console.log('📸 Using model reference as primary input for model shot')
        primaryInputImage = model_reference_image

        // Enhance prompt to reference the jewelry image
        enhancedPrompt = `${prompt}\n\nIMPORTANT: The model should be wearing jewelry identical to the reference jewelry image provided. Ensure the jewelry details, materials, colors, and design elements match exactly the jewelry shown in the reference.`
      } else {
        console.log('🎨 Using jewelry image as primary input for product shot')
        // For product shots, keep jewelry image as primary
        primaryInputImage = input_image
      }
    }

    // Prepare request body for BFL API
    const requestBody: FluxKontextProRequestBody = {
      prompt: enhancedPrompt,
      output_format,
      prompt_upsampling,
      safety_tolerance
    }

    // Add primary input image
    if (primaryInputImage) {
      requestBody.input_image = primaryInputImage
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

    console.log('🚀 Calling Flux Kontext Pro API:', {
      prompt: enhancedPrompt.substring(0, 100) + '...',
      hasInputImage: !!input_image,
      hasModelReference: !!model_reference_image,
      usingPrimaryImage: !!primaryInputImage,
      aspectRatio: aspect_ratio,
      seed,
      promptUpsampling: prompt_upsampling,
      safetyTolerance: safety_tolerance,
      modelId: 7
    })

    // Call BFL API
    const bflResponse = await fetch('https://api.bfl.ai/v1/flux-kontext-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': process.env.FLUX_API_KEY!,
      },
      body: JSON.stringify(requestBody),
    })

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

    // Get the generated image URL
    let permanentImageUrl = null
    const originalImageUrl = pollResult.result?.sample || null

    if (originalImageUrl) {
      console.log('✅ Image generated successfully by BFL API')
      // Use the BFL URL directly - it's already accessible
      permanentImageUrl = originalImageUrl
      console.log('🔗 Using BFL URL directly:', permanentImageUrl)
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
        sample: permanentImageUrl
      },
      imageUrl: permanentImageUrl,  // Primary image URL
      originalImageUrl: originalImageUrl,  // Original BFL URL (for reference)
      timestamp: new Date().toISOString(),
      // Add metadata for better error handling
      metadata: {
        model: 'flux-kontext-pro',
        modelId: 7,
        prompt: requestBody.prompt.substring(0, 100),
        aspectRatio: requestBody.aspect_ratio,
        hasInputImage: !!requestBody.input_image
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
    console.error('Flux Kontext Pro API Error:', error)
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

      const data = await response.json()
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
