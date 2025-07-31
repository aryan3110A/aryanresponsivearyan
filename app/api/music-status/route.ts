import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trace_id = searchParams.get('trace_id')
    const output_format = searchParams.get('output_format') || 'hex'

    if (!trace_id) {
      return NextResponse.json({ error: 'trace_id is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.minimax.io/v1/music_generation/query?trace_id=${trace_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `MiniMax API error: ${response.status} - ${errorText}` }, { status: response.status })
    }

    const data = await response.json()

    if (data.base_resp?.status_code !== 0) {
      return NextResponse.json({
        status: 'error',
        status_code: data.base_resp.status_code,
        status_msg: data.base_resp.status_msg,
        trace_id,
      }, { status: 400 })
    }

    if (data.data?.status === 1) {
      // Still processing
      return NextResponse.json({
        status: 'pending',
        trace_id,
        status_msg: 'Music generation in progress.'
      })
    }

    // Done
    if (output_format === 'hex') {
      return NextResponse.json({
        status: 'done',
        trace_id,
        audio_data: data.data.audio,
        audio_format: data.data.format || 'mp3',
        status_msg: 'Music generated successfully.'
      })
    } else if (output_format === 'url') {
      return NextResponse.json({
        status: 'done',
        trace_id,
        audio_url: data.data.audio_url,
        audio_format: data.data.format || 'mp3',
        status_msg: 'Music generated successfully.'
      })
    }

    // Fallback
    return NextResponse.json({
      status: 'done',
      trace_id,
      status_msg: 'Music generated successfully, but no audio data found.'
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}