import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    const videosDir = path.join(process.cwd(), 'public', 'static', 'videos')
    const filePath = path.join(videosDir, filename)
    
    try {
      const stats = await fs.stat(filePath)
      const exists = stats.isFile()
      const size = stats.size
      
      return NextResponse.json({
        exists,
        size,
        path: filePath,
        publicUrl: `/static/videos/${filename}`,
        message: exists ? 'Video file exists and is accessible' : 'Video file not found'
      })
    } catch {
      return NextResponse.json(
        { error: 'Failed to process video' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
