import {  NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt, model, width, height, num_images } = await request.json()
    console.log( { prompt, model, width, height, num_images })
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Map model names to backend endpoints
    const modelEndpoints: Record<string, string> = {
      "Stable XL": "stable-xl",
      "Flux.1 Dev": "flux-dev", 
      "Stable Diffusion 3.5 Large": "stable-large",
      "Stable Diffusion 3.5 Medium": "stable-medium",
      "Stable Turbo": "stable-turbo"
    }

    const modelKey = modelEndpoints[model] || "flux-dev"
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    
    // Call the model-specific endpoint
    const endpoint = `${API_BASE}/${modelKey}/generate`
    console.log('Calling endpoint:', endpoint)
    
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
      console.error(`Backend error for ${modelKey}:`, errorText)
      return NextResponse.json({ error: `${modelKey} generation failed` }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}