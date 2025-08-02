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
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://c9b20607338c.ngrok-free.app'

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
    const { prompt, model, width, height, num_images, modelId, input_image } = await request.json()
    console.log('🚀 Generate Image API called:', { prompt, model, width, height, num_images, modelId, hasInputImage: !!input_image })
    
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
      return await callFluxAPI(fluxEndpoint, modelName, prompt, width, height, num_images, input_image)
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

// Helper function to call Flux APIs
async function callFluxAPI(endpoint: string, modelName: string, prompt: string, width: number, height: number, num_images: number, input_image?: string) {
  console.log(`📡 Calling ${modelName} endpoint: ${endpoint}`)
  console.log(`📸 Input image provided: ${!!input_image}`)
  
  try {
    // Call Flux API directly by importing the route handlers
    if (endpoint === '/api/flux-kontext-max') {
      const { POST: fluxMaxHandler } = await import('../flux-kontext-max/route')
      
      // Create a proper NextRequest with the body
      const requestBody = {
        prompt,
        aspect_ratio: `${width || 768}:${height || 768}`,
        output_format: 'png',
        prompt_upsampling: false,
        safety_tolerance: 2,
        seed: Math.floor(Math.random() * 1000000),
        ...(input_image && { input_image })
      }
      
      console.log(`📤 Sending to Flux Max:`, {
        hasInputImage: !!input_image,
        promptLength: prompt.length,
        aspectRatio: requestBody.aspect_ratio
      })
      
      const request = new NextRequest('http://localhost/api/flux-kontext-max', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      return await fluxMaxHandler(request)
    } else if (endpoint === '/api/flux-kontext-pro') {
      const { POST: fluxProHandler } = await import('../flux-kontext-pro/route')
      
      // Create a proper NextRequest with the body
      const requestBody = {
        prompt,
        aspect_ratio: `${width || 768}:${height || 768}`,
        output_format: 'png',
        prompt_upsampling: false,
        safety_tolerance: 2,
        seed: Math.floor(Math.random() * 1000000),
        ...(input_image && { input_image })
      }
      
      console.log(`📤 Sending to Flux Pro:`, {
        hasInputImage: !!input_image,
        promptLength: prompt.length,
        aspectRatio: requestBody.aspect_ratio
      })
      
      const request = new NextRequest('http://localhost/api/flux-kontext-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      return await fluxProHandler(request)
    } else {
      throw new Error(`Unknown Flux endpoint: ${endpoint}`)
    }
  } catch (error) {
    console.error(`❌ ${modelName} API error:`, error)
    console.log(`🔄 ${modelName} failed, falling back to Stable Turbo`)
    
    // For image-to-image, we need to handle the case where Flux API fails
    if (input_image) {
      console.log(`⚠️ Image-to-image requested but Flux API failed. Using Stable Turbo for text-to-image instead.`)
      // Note: Stable Turbo doesn't support image-to-image, so we'll generate text-to-image
    }
    
    return await handleRegularModel(prompt, "Stable Turbo", width, height, num_images)
  }
}