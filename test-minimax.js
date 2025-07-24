// Test script to debug MiniMax API integration
const API_KEY = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJNaWhpciBWYXJ1ZGUiLCJVc2VyTmFtZSI6Ik1paGlyIFZhcnVkZSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTQ3OTA0NDk4MjM2MTMzODM4IiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTk0NzkwNDQ5ODIzMTkzOTUzNCIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6Im1paGlyQHdpbGRtaW5kYWkuY29tIiwiQ3JlYXRlVGltZSI6IjIwMjUtMDctMjMgMjA6NTE6NTkiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.f05eWWVjsmqYPF5xb1hcnUTTYSEhmrLz9vc_RBVIrh-1dBCf6e3mEcVwyvgp3XUi5CfDCxAHaL3wKCpjrLBk5cV-3lZOfmyNkcTBXVHJdOLmo-ofC5CvheMpmM0qRy6BHupjB5z8TEm3fUWpNVq7hq4Unz7Q_RsCn-j3WdAhKt1bicrPWXB3KTv2oz4Ra7-bu9YD_1I-xRXjEtXrQZAnBKjeETxTOLyKXTF_X-i7KHas4_ssb56jOfNJxYGvski6tBNRry13gB806O2dIErYbGtiF5ln3KvsL8N6EwjN32JA5ilXS7JYnU4T3-s8dzAj2WqNlZ6zXwRlGJv8_USkyg"

async function testMiniMaxAPI() {
  console.log('Testing MiniMax API directly...')
  
  // Extract GroupId from JWT token
  function extractGroupIdFromToken(token) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      console.log('JWT Payload:', payload)
      return payload.GroupID || 'default_group'
    } catch (error) {
      console.error('Error extracting GroupId from token:', error)
      return 'default_group'
    }
  }

  const groupId = extractGroupIdFromToken(API_KEY)
  console.log('Extracted GroupId:', groupId)

  const payload = {
    model: "MiniMax-Hailuo-02",
    prompt: "A beautiful sunset over the ocean",
    duration: 6,
    resolution: "768P",
    prompt_optimizer: true
  }

  console.log('Sending request with payload:', payload)

  try {
    const response = await fetch('https://api.minimax.io/v1/video_generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseText = await response.text()
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('Response body:', responseText)

    if (!response.ok) {
      console.error('API Error:', response.status, responseText)
      return
    }

    const data = JSON.parse(responseText)
    console.log('Parsed response:', data)

    if (data.task_id) {
      console.log('✅ Task created successfully with ID:', data.task_id)
    } else {
      console.log('❌ No task ID in response')
    }

  } catch (error) {
    console.error('Request failed:', error)
  }
}

testMiniMaxAPI()
