import { NextResponse } from 'next/server'
import { testFirebaseStorage } from '@/lib/firebase'

export async function GET() {
  try {
    console.log('🧪 Testing Firebase configuration...')
    
    // Check environment variables
    const envVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'
    }
    
    console.log('📋 Environment variables:', envVars)
    
    // Test Firebase Storage connection
    const firebaseTest = await testFirebaseStorage()
    console.log('🔥 Firebase Storage test result:', firebaseTest)
    
    return NextResponse.json({
      success: firebaseTest.success,
      environment: envVars,
      firebase: firebaseTest,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Firebase test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 