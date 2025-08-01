import { NextRequest, NextResponse } from 'next/server'

const MINIMAX_API_BASE = 'https://api.minimax.io/v1'
const API_KEY = process.env.NEXT_PUBLIC_MINMAX_API_KEY

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'MiniMax API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { task_id } = body

    if (!task_id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    console.log('Querying video generation status for task:', task_id)

    // Step 2: Query task status
    const response = await fetch(`${MINIMAX_API_BASE}/query/video_generation?task_id=${task_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.base_resp?.status_msg || `HTTP ${response.status}`)
    }

    const statusResponse = await response.json()
    const taskStatus = statusResponse.status
    const fileId = statusResponse.file_id

    console.log(`Task ${task_id} status: ${taskStatus}`)

    // Return status immediately
    return NextResponse.json({
      success: true,
      task_id: task_id,
      status: taskStatus,
      file_id: fileId,
      message: `Task status: ${taskStatus}`,
      next_step: taskStatus === 'Success' && fileId 
        ? 'Call /api/download-video with the file_id to get the video URL'
        : taskStatus === 'Fail' 
        ? 'Video generation failed'
        : 'Continue polling for status updates'
    })

  } catch (error: unknown) {
    console.error('Video status query failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Status query failed'
    }, { status: 500 })
  }
} 