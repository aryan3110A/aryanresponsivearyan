// Simple test script for the MiniMax video generation API
// Run with: node test.js

const API_BASE = 'http://localhost:3000'

async function testVideoGeneration() {
  try {
    console.log('Testing MiniMax video generation API...')
    
    const response = await fetch(`${API_BASE}/api/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "A beautiful sunset over the ocean",
        model: "MiniMax-Hailuo-02",
        selectedAspectRatio: "16:9",
        selectedQuality: "HD",
        duration: 6
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ API test successful!')
      console.log('Response:', data)
    } else {
      console.log('❌ API test failed!')
      console.log('Error:', data)
    }
  } catch (error) {
    console.log('❌ API test failed with exception!')
    console.error('Error:', error.message)
  }
}

// Run the test
testVideoGeneration()
