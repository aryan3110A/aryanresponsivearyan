import {  NextResponse } from 'next/server'

// Helper function to handle regular model generation
async function handleRegularModel(prompt: string, model: string, width: number, height: number, num_images: number) {
  // Map model names to backend endpoints for existing models
  const modelEndpoints: Record<string, string> = {
    "Stable XL": "stable-xl",
    "Flux.1 Dev": "flux-dev", 
    "Stable Diffusion 3.5 Large": "stable-large",
    "Stable Diffusion 3.5 Medium": "stable-medium",
    "Stable Turbo": "stable-turbo",
    "Flux.1 KONTEXT MAX": "flux-kontext-max",
    "Flux.1 KONTEXT PRO": "flux-kontext-pro"
  }

  const modelKey = modelEndpoints[model] || "stable-turbo"
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://c9b20607338c.ngrok-free.app'

  // Use a different endpoint for Kontext Max/Pro models
  let endpoint = (model === "Flux.1 KONTEXT MAX" || model === "Flux.1 KONTEXT PRO")
    ? `${API_BASE}/${modelKey}`
    : `${API_BASE}/${modelKey}/generate`;

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

    // Check if it's a Flux model (ID 6 for Max, ID 7 for Pro)
    if (modelId === 6 || modelId === 7) {
      console.log(`🎯 Using Flux Kontext ${modelId === 6 ? 'Max' : 'Pro'} (ID: ${modelId})`)
      
      const fluxEndpoint = modelId === 6 ? '/api/flux-kontext-max' : '/api/flux-kontext-pro'
      const modelName = modelId === 6 ? 'Flux Kontext Max' : 'Flux Kontext Pro'
      
      console.log(`📡 Calling ${modelName} endpoint: ${fluxEndpoint}`)
      
      try {
        // Call the Flux API
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${fluxEndpoint}`, {
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
          
          // If Flux API fails, fallback to stable-turbo (a working backend endpoint)
          console.log(`🔄 Flux API failed, falling back to stable-turbo`)
          return await handleRegularModel(prompt, "Stable Turbo", width, height, num_images)
        }

        const data = await response.json()
        console.log(`✅ ${modelName} generation successful:`, { 
          hasImageUrl: !!data.imageUrl,
          model: data.metadata?.model 
        })
        return NextResponse.json(data)
      } catch (error) {
        console.error(`❌ ${modelName} API failed with error:`, error)
        console.log(`🔄 Falling back to stable-turbo`)
        return await handleRegularModel(prompt, "Stable Turbo", width, height, num_images)
      }
    }

    // Use the helper function for regular models
    return await handleRegularModel(prompt, model, width, height, num_images)
    
  } catch (error) {
    console.error('❌ API Route Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}