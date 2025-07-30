import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
    }
    
    // Validate that it's a Firebase Storage URL
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }
    
    console.log('🔄 Proxying Firebase Storage image:', imageUrl)
    
    // Fetch the image from Firebase Storage
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'WildMind-ImageProxy/1.0'
      }
    })
    
    if (!response.ok) {
      console.error('❌ Failed to fetch image:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` }, 
        { status: response.status }
      )
    }
    
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('Content-Type') || 'image/png'
    
    console.log('✅ Image proxied successfully:', {
      size: imageBuffer.byteLength,
      contentType,
      url: imageUrl.substring(0, 100) + '...'
    })
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('❌ Image proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
