import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testUrl = searchParams.get('url')

    if (!testUrl) {
      return NextResponse.json({ 
        error: 'Test URL is required',
        usage: 'Add ?url=YOUR_IMAGE_URL to test the download functionality'
      }, { status: 400 })
    }

    console.log('🧪 Testing download functionality with URL:', testUrl)

    // Test the download proxy API
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(testUrl)}&filename=test-image.jpg`
    
    const response = await fetch(`http://localhost:3000${proxyUrl}`, {
      method: 'GET'
    })

    const result = {
      testUrl,
      proxyUrl,
      responseStatus: response.status,
      responseOk: response.ok,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      timestamp: new Date().toISOString()
    }

    console.log('🧪 Test result:', result)

    return NextResponse.json({
      message: 'Download test completed',
      result
    })

  } catch (error) {
    console.error('❌ Test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 