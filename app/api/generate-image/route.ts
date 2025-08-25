import {  NextResponse } from 'next/server'

// Helper function to handle regular model generation
async function handleRegularModel(prompt: string, model: string, width: number, height: number, num_images: number) {

  console.log("Model called:", { model});
  
  // Map model names to backend endpoints for existing models
  const modelEndpoints: Record<string, string> = {
    "Stable XL": "stable-xl",
    "Flux.1 Dev": "flux-dev", 
    "Stable Diffusion 3.5 Large": "stable-large",
    "Stable Diffusion 3.5 Medium": "stable-medium",
    "Stable Turbo": "stable-turbo"
  }

  const modelKey = modelEndpoints[model] || "stable-turbo"
  console.log("Model key:", { modelKey, model });
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://e80710442ad8.ngrok-free.app'

  // Always use the /generate endpoint for backend models
  const endpoint = `${API_BASE}/${modelKey}/generate`;

  console.log(`🎯 Using fallback model: ${model} (${modelKey})`);
  // Call the model-specific endpoint
  console.log('📡 Calling fallback endpoint:', endpoint)
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      width: width || 768,
      height: height || 768,
      num_images: num_images || 1,
    }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`❌ Fallback backend error for ${modelKey}:`, errorText)
    return NextResponse.json({ error: `${modelKey} generation failed` }, { status: 500 })
  }

  const data = await response.json()
  console.log(`✅ Fallback ${model} generation successful`)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const { prompt, model, width, height, num_images, modelId, input_image, aspect_ratio } = await request.json()
    console.log('🚀 Generate Image API called:', { prompt, model, width, height, num_images, modelId, hasInputImage: !!input_image, aspect_ratio })
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Check if it's a Flux model first
    if (modelId === 6 || modelId === 7) {
      // Validate Flux API key
      console.log('🔍 Checking FLUX_API_KEY:', process.env.FLUX_API_KEY ? '✅ Set' : '❌ Not set');
      if (!process.env.FLUX_API_KEY) {
        console.error('❌ FLUX_API_KEY not configured')
        return NextResponse.json({ 
          error: 'Flux API key not configured. Please set FLUX_API_KEY environment variable in Vercel deployment.' 
        }, { status: 500 })
      }
      
      const fluxEndpoint = modelId === 6 ? '/api/flux-kontext-max' : '/api/flux-kontext-pro'
      const modelName = modelId === 6 ? 'Flux Kontext Max' : 'Flux Kontext Pro'
      console.log(`🎯 Using ${modelName} (ID: ${modelId})`)
      return await callFluxAPI(fluxEndpoint, modelName, prompt, width, height, num_images, input_image, aspect_ratio)
    }

    // For all other models, check if they exist in backend endpoints
    const modelEndpoints: Record<string, string> = {
      "Stable XL": "stable-xl",
      "Flux.1 Dev": "flux-dev", 
      "Stable Diffusion 3.5 Large": "stable-large",
      "Stable Diffusion 3.5 Medium": "stable-medium",
      "Stable Turbo": "stable-turbo"
    }

    if (modelEndpoints[model]) {
      console.log(`🎯 Using backend model: ${model}`)
      return await handleRegularModel(prompt, model, width, height, num_images)
    } else {
      console.log(`❌ Model not found: ${model}, falling back to Stable Turbo`)
      return await handleRegularModel(prompt, "Stable Turbo", width, height, num_images)
    }
    
  } catch (error) {
    console.error('❌ API Route Error:', error);
    return NextResponse.json({ error: `${error}` }, { status: 500 })
  }
}

// Helper function to call Flux APIs with progressive image generation
async function callFluxAPI(endpoint: string, modelName: string, prompt: string, width: number, height: number, num_images: number, input_image?: string, aspect_ratio?: string) {
  console.log(`📡 Calling ${modelName} endpoint: ${endpoint}`)
  console.log(`🖼️ Generating ${num_images} image(s)`)
  
  try {
    // For progressive generation, we'll return images as they complete
    const generationPromises: Promise<string>[] = []
    
    // Create promises for each image generation
    for (let i = 0; i < num_images; i++) {
      const imagePromise = generateSingleImage(endpoint, modelName, prompt, width, height, i + 1, num_images, input_image, aspect_ratio)
      generationPromises.push(imagePromise)
    }
    
    // Wait for all images to complete
    const results = await Promise.all(generationPromises)
    
    // Return all generated images
    return NextResponse.json({
      image_urls: results,
      metadata: {
        model: modelName,
        count: results.length
      }
    })
  } catch (error) {
    console.error(`❌ ${modelName} API error:`, error)
    console.log(`🔄 ${modelName} failed, falling back to Stable Turbo`)
    return await handleRegularModel(prompt, "Stable Turbo", width, height, num_images)
  }
}

// Helper function to generate a single image
async function generateSingleImage(endpoint: string, modelName: string, prompt: string, width: number, height: number, imageNumber: number, totalImages: number, input_image?: string, aspect_ratio?: string): Promise<string> {
  console.log(`🔄 Generating image ${imageNumber}/${totalImages}`)
  
  try {
    // If calling Flux models, hit BFL API directly to avoid Vercel protection on internal routes
    const isFluxMax = endpoint.includes('flux-kontext-max')
    const isFluxPro = endpoint.includes('flux-kontext-pro')

    if (isFluxMax || isFluxPro) {
      if (!process.env.FLUX_API_KEY) {
        throw new Error('FLUX_API_KEY not configured')
      }

      const bflEndpoint = isFluxMax
        ? 'https://api.bfl.ai/v1/flux-kontext-max'
        : 'https://api.bfl.ai/v1/flux-kontext-pro'

      const requestBody: any = {
        prompt,
        output_format: 'png',
        prompt_upsampling: false,
        safety_tolerance: 2,
      }

      if (typeof aspect_ratio === 'string' && aspect_ratio.trim().length > 0) {
        requestBody.aspect_ratio = aspect_ratio
      } else if (width && height) {
        requestBody.aspect_ratio = `${width}:${height}`
      }
      if (input_image) {
        requestBody.input_image = input_image
      }

      console.log('🌐 Calling BFL API:', bflEndpoint)
      const start = Date.now()
      const bflResponse = await fetch(bflEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-key': process.env.FLUX_API_KEY as string,
        },
        body: JSON.stringify(requestBody),
      })

      if (!bflResponse.ok) {
        const errorData = await bflResponse.text()
        console.error('BFL API Error:', bflResponse.status, errorData)
        throw new Error(`BFL API error: ${bflResponse.status}`)
      }

      const initData: { polling_url?: string } = await bflResponse.json()
      if (!initData.polling_url) {
        throw new Error('No polling URL received from BFL API')
      }

      // Poll for result
      const imageUrl = await pollBflForResult(initData.polling_url)
      console.log(`✅ Image ${imageNumber}/${totalImages} completed in ${Date.now() - start}ms`)
      return imageUrl
    }

    // Non-Flux endpoints (should not happen currently)
    throw new Error('Unsupported endpoint for generateSingleImage')
  } catch (error) {
    console.error(`❌ Error generating image ${imageNumber}/${totalImages}:`, error)
    throw error
  }
}

// Poll BFL API until the result is ready
async function pollBflForResult(pollingUrl: string, maxAttempts = 30, intervalMs = 2000): Promise<string> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(pollingUrl, {
        headers: {
          'x-key': process.env.FLUX_API_KEY as string,
        },
      })

      if (!response.ok) {
        console.warn(`⚠️ Polling error (attempt ${attempt}):`, response.status)
      } else {
        const data: { status?: string; result?: { sample?: string } } = await response.json()
        if (data.status === 'Ready' && data.result?.sample) {
          return data.result.sample
        }
        if (data.status === 'Error' || data.status === 'Request Moderated') {
          throw new Error(`Generation failed: ${data.status}`)
        }
      }
    } catch (err) {
      console.warn(`⚠️ Polling attempt ${attempt} failed:`, err)
      if (attempt === maxAttempts) {
        throw err
      }
    }

    await new Promise(res => setTimeout(res, intervalMs))
  }

  throw new Error('Generation timed out')
}