import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
    }
    
    // Validate that it's a Firebase Storage URL, BFL API URL, or ngrok URL
    const isValidUrl = imageUrl.includes('firebasestorage.googleapis.com') || 
                      imageUrl.includes('delivery-us1.bfl.ai') ||
                      imageUrl.includes('delivery-eu1.bfl.ai') ||
                      imageUrl.includes('bfl.ai') ||
                      imageUrl.includes('ngrok-free.app')
    
    if (!isValidUrl) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
    }
    
    console.log('🔄 Proxying image:', imageUrl.substring(0, 100) + '...')
    
    // Fetch the image with appropriate headers
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'WildMind-ImageProxy/1.0',
        'Accept': 'image/*',
        'Referer': 'https://api.bfl.ai/',
        'ngrok-skip-browser-warning': 'true' // Bypass ngrok warning page
      }
    })
    
    console.log(`📊 Proxy response status: ${response.status}`)
    console.log(`📊 Proxy response headers:`, Object.fromEntries(response.headers.entries()))
    
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
