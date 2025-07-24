// Test script to debug MiniMax file retrieval
const API_KEY = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJNaWhpciBWYXJ1ZGUiLCJVc2VyTmFtZSI6Ik1paGlyIFZhcnVkZSIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTQ3OTA0NDk4MjM2MTMzODM4IiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTk0NzkwNDQ5ODIzMTkzOTUzNCIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6Im1paGlyQHdpbGRtaW5kYWkuY29tIiwiQ3JlYXRlVGltZSI6IjIwMjUtMDctMjMgMjA6NTE6NTkiLCJUb2tlblR5cGUiOjEsImlzcyI6Im1pbmltYXgifQ.f05eWWVjsmqYPF5xb1hcnUTTYSEhmrLz9vc_RBVIrh-1dBCf6e3mEcVwyvgp3XUi5CfDCxAHaL3wKCpjrLBk5cV-3lZOfmyNkcTBXVHJdOLmo-ofC5CvheMpmM0qRy6BHupjB5z8TEm3fUWpNVq7hq4Unz7Q_RsCn-j3WdAhKt1bicrPWXB3KTv2oz4Ra7-bu9YD_1I-xRXjEtXrQZAnBKjeETxTOLyKXTF_X-i7KHas4_ssb56jOfNJxYGvski6tBNRry13gB806O2dIErYbGtiF5ln3KvsL8N6EwjN32JA5ilXS7JYnU4T3-s8dzAj2WqNlZ6zXwRlGJv8_USkyg"

async function testFileRetrieval() {
  console.log('Testing MiniMax file retrieval...')
  
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

  // Use a file ID from your successful generation (replace with actual file ID)
  const fileId = "293781796376708" // From your logs

  console.log('Testing file retrieval for:', { fileId, groupId })

  // Test different URL formats
  const urlFormats = [
    `https://api.minimax.io/v1/files/retrieve?GroupId=${groupId}&file_id=${fileId}`,
    `https://api.minimax.io/v1/files/retrieve?group_id=${groupId}&file_id=${fileId}`,
    `https://api.minimax.io/v1/files/retrieve/${fileId}?GroupId=${groupId}`,
  ]

  for (const url of urlFormats) {
    console.log('\n--- Testing URL format:', url)
    
    try {
      // Test POST request
      console.log('Trying POST request...')
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      console.log('POST Response status:', response.status)
      const postText = await response.text()
      console.log('POST Response body:', postText)

      if (response.ok) {
        console.log('✅ POST request successful!')
        break
      }

      // Test GET request
      console.log('Trying GET request...')
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        }
      })

      console.log('GET Response status:', response.status)
      const getText = await response.text()
      console.log('GET Response body:', getText)

      if (response.ok) {
        console.log('✅ GET request successful!')
        break
      }

    } catch (error) {
      console.error('Request failed:', error.message)
    }
  }
}

testFileRetrieval()
