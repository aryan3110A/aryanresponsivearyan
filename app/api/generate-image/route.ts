import {  NextResponse, NextRequest } from 'next/server'

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
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://a5847c1d5e30.ngrok-free.app'

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
  
  // Call Flux API directly by importing the route handlers
  if (endpoint === '/api/flux-kontext-max') {
    const { POST: fluxMaxHandler } = await import('../flux-kontext-max/route')
    const requestBody: any = {
      prompt,
      output_format: 'png',
      prompt_upsampling: false,
      safety_tolerance: 2,
      seed: Math.floor(Math.random() * 1000000)
    }
    
    // Use aspect_ratio if provided, otherwise calculate from width/height
    if (aspect_ratio) {
      requestBody.aspect_ratio = aspect_ratio
    } else {
      requestBody.aspect_ratio = `${width}:${height}`
    }
    
    if (input_image) {
      requestBody.input_image = input_image
    }
    
    const request = new NextRequest('http://localhost/api/flux-kontext-max', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    const response = await fluxMaxHandler(request)
    const data = await response.json()
    
    if (data.imageUrl) {
      console.log(`✅ Image ${imageNumber}/${totalImages} completed`)
      return data.imageUrl
    } else {
      throw new Error(`No image URL received for image ${imageNumber}`)
    }
  } else if (endpoint === '/api/flux-kontext-pro') {
    const { POST: fluxProHandler } = await import('../flux-kontext-pro/route')
    const requestBody: any = {
      prompt,
      output_format: 'png',
      prompt_upsampling: false,
      safety_tolerance: 2,
      seed: Math.floor(Math.random() * 1000000)
    }
    
    // Use aspect_ratio if provided, otherwise calculate from width/height
    if (aspect_ratio) {
      requestBody.aspect_ratio = aspect_ratio
    } else {
      requestBody.aspect_ratio = `${width}:${height}`
    }
    
    if (input_image) {
      requestBody.input_image = input_image
    }
    
    const request = new NextRequest('http://localhost/api/flux-kontext-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    const response = await fluxProHandler(request)
    const data = await response.json()
    
    if (data.imageUrl) {
      console.log(`✅ Image ${imageNumber}/${totalImages} completed`)
      return data.imageUrl
    } else {
      throw new Error(`No image URL received for image ${imageNumber}`)
    }
  } else {
    throw new Error(`Unknown Flux endpoint: ${endpoint}`)
  }
}