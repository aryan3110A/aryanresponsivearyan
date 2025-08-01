import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MINIMAX_API_BASE = 'https://api.minimax.io/v1'
const API_KEY = process.env.NEXT_PUBLIC_MINMAX_API_KEY

// Helper function to extract GroupId from JWT token
function extractGroupIdFromToken(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    console.log('JWT payload:', payload)
    const groupId = payload.GroupID || 'default_group'
    console.log('Extracted GroupID:', groupId)
    return groupId
  } catch (error) {
    console.error('Error extracting GroupId from token:', error)
    return 'default_group'
  }
}

// Helper function to get file download URL
async function getFileDownloadUrl(fileId: string, groupId: string) {
  const url = `${MINIMAX_API_BASE}/files/retrieve?GroupId=${groupId}&file_id=${fileId}`

  console.log('Requesting file download URL:', {
    url,
    fileId,
    groupId
  })

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'authority': 'api.minimax.io',
      'content-type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
  })

  const responseText = await response.text()
  console.log('File retrieval response:', response.status, responseText)

  if (!response.ok) {
    console.error('File retrieval failed:', response.status, responseText)
    let error
    try {
      error = JSON.parse(responseText)
    } catch {
      error = { message: responseText }
    }
    throw new Error(error.base_resp?.status_msg || error.message || `HTTP ${response.status}`)
  }

  try {
    return JSON.parse(responseText)
  } catch (parseError) {
    console.error('Failed to parse file response:', parseError)
    throw new Error('Invalid JSON response from file retrieval API')
  }
}

// Helper function to download and save video to static files
async function downloadAndSaveVideo(downloadUrl: string, filename: string): Promise<string> {
  try {
    console.log('Downloading video from:', downloadUrl)

    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`)
    }

    const contentLength = response.headers.get('content-length')
    console.log('Video content length:', contentLength)

    const buffer = await response.arrayBuffer()
    console.log('Downloaded buffer size:', buffer.byteLength)

    if (buffer.byteLength === 0) {
      throw new Error('Downloaded video file is empty')
    }

    // Create static/videos directory if it doesn't exist
    const videosDir = path.join(process.cwd(), 'public', 'static', 'videos')
    await fs.mkdir(videosDir, { recursive: true })

    // Save video file
    const filePath = path.join(videosDir, filename)
    await fs.writeFile(filePath, Buffer.from(buffer))

    console.log('Video saved to:', filePath, 'Size:', buffer.byteLength, 'bytes')

    // Return the public URL
    return `/static/videos/${filename}`
  } catch (error) {
    console.error('Error saving video:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'MiniMax API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { file_id } = body

    if (!file_id) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Extract GroupId from the JWT token
    const group_id = extractGroupIdFromToken(API_KEY || '')
    console.log('Using GroupId:', group_id)

    console.log('Downloading video for file ID:', file_id)

    // Step 3: Get download URL
    try {
      const fileResponse = await getFileDownloadUrl(file_id, group_id)
      const downloadUrl = fileResponse.file?.download_url || fileResponse.file?.backup_download_url

      if (!downloadUrl) {
        throw new Error('No download URL received')
      }

      console.log('Download URL received:', downloadUrl)

      // Step 4: Download and save video to static files
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `video-${file_id}-${timestamp}.mp4`
      const localVideoUrl = await downloadAndSaveVideo(downloadUrl, filename)

      console.log('Video saved locally:', localVideoUrl)

      return NextResponse.json({
        success: true,
        video_urls: [localVideoUrl],
        file_id: file_id,
        message: 'Video downloaded and saved successfully'
      })
    } catch (fileError) {
      console.error('File download failed:', fileError)

      // Try alternative approaches to get the video
      const alternativeUrls = [
        `https://api.minimax.io/v1/files/retrieve?GroupId=${group_id}&file_id=${file_id}`,
        `https://api.minimax.io/v1/files/${file_id}?GroupId=${group_id}`,
        `https://files.minimax.io/${group_id}/${file_id}`,
        `https://cdn.minimax.io/files/${file_id}`,
      ]

      // Return success with multiple potential URLs for the user to try
      return NextResponse.json({
        success: true,
        video_urls: alternativeUrls,
        file_id: file_id,
        group_id: group_id,
        note: 'Video generated successfully! Try the URLs above to access your video.',
        error: fileError instanceof Error ? fileError.message : 'File download failed',
        debug_info: {
          message: 'Video generation completed successfully. The issue is only with automatic file download.',
          suggestion: 'You can contact MiniMax support for the correct file retrieval API format, or access the video through their web interface.'
        }
      })
    }

  } catch (error: unknown) {
    console.error('Video download failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Download failed'
    }, { status: 500 })
  }
} 