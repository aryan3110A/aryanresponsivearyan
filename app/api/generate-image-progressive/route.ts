import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🚀 Progressive Generate Image API called:', { 
      prompt: body.prompt?.substring(0, 50) + '...',
      modelId: body.modelId,
      num_images: body.num_images,
      hasInputImage: !!body.input_image 
    })
    
    // Simply forward the request to the regular generate-image endpoint (absolute URL for server-side fetch)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const response = await fetch(`${baseUrl}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Progressive API error:', errorText)
      return NextResponse.json({ error: `Generation failed: ${response.status}` }, { status: response.status })
    }
    
    const data = await response.json()
    console.log('✅ Progressive generation successful:', { 
      hasImageUrls: !!data.image_urls,
      imageCount: data.image_urls?.length 
    })
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Progressive API Route Error:', error);
    return NextResponse.json({ error: `${error}` }, { status: 500 })
  }
} 