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
    const { prompt, model, width, height, num_images, modelId, input_image, aspect_ratio, output_format, prompt_upsampling, safety_tolerance, seed } = await request.json()
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
      return await callFluxAPI(fluxEndpoint, modelName, prompt, width, height, num_images, input_image, aspect_ratio, output_format, prompt_upsampling, safety_tolerance, seed)
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
async function callFluxAPI(endpoint: string, modelName: string, prompt: string, width: number, height: number, num_images: number, input_image?: string, aspect_ratio?: string, output_format?: string, prompt_upsampling?: boolean, safety_tolerance?: number, seed?: number) {
  console.log(`📡 Calling ${modelName} endpoint: ${endpoint}`)
  
  // Use relative URL for serverless environment compatibility
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspect_ratio || `${width}:${height}`,
      output_format: output_format || 'png',
      prompt_upsampling: prompt_upsampling || false,
      safety_tolerance: safety_tolerance || 2,
      seed: seed || Math.floor(Math.random() * 1000000), // Random seed
      ...(input_image && { input_image })
    }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`❌ ${modelName} API error:`, errorText)
    return NextResponse.json({ error: `${modelName} generation failed` }, { status: 500 })
  }

  const data = await response.json()
  console.log(`✅ ${modelName} generation successful:`, { 
    hasImageUrl: !!data.imageUrl,
    model: data.metadata?.model 
  })
  return NextResponse.json(data)
}