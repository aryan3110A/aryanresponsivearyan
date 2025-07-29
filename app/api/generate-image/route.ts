import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, model, width, height, num_images } = body

    if (!prompt || !model) {
      return NextResponse.json({ error: 'Prompt and model are required' }, { status: 400 })
    }

    // ✅ Correct mapping
    const modelEndpoints: Record<string, string> = {
      "Stable XL": "stable-xl",
      "Flux.1 Dev": "flux-dev",
      "Stable Diffusion 3.5 Large": "stable-large",
      "Stable Diffusion 3.5 Medium": "stable-medium",
      "Stable Turbo": "stable-turbo"
    }

    const modelKey = modelEndpoints[model]
    if (!modelKey) {
      console.warn(`⚠️ Unrecognized model name received: "${model}"`)
      return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 })
    }

    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const endpoint = `${API_BASE}/${modelKey}/generate`

    console.log(`🚀 Generating image with model: ${modelKey}`)
    console.log(`📡 Backend endpoint: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        width: width || 768,
        height: height || 768,
        num_images: num_images || 1
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Error from ${modelKey} backend:`, errorText)
      return NextResponse.json({ error: `${modelKey} generation failed`, details: errorText }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('🔥 Uncaught API Route Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
