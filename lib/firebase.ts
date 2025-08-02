import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCK-En8z1r18mBNtrvS4iDJQEG2cYDtvyA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "wild-mind-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wild-mind-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "wild-mind-ai.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "40401541974",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:40401541974:web:8662e9b5b4a7d73a1ad4f7"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Storage
export const storage = getStorage(app)

// Test Firebase Storage connection
export async function testFirebaseStorage() {
  try {
    console.log('🔥 Testing Firebase Storage connection...')
    console.log('📋 Storage bucket:', firebaseConfig.storageBucket)
    console.log('📋 Project ID:', firebaseConfig.projectId)

    // Try to get storage reference
    const { ref } = await import('firebase/storage')
    const testRef = ref(storage, 'test-connection.txt')
    console.log('✅ Firebase Storage reference created successfully')
    console.log('📍 Test reference path:', testRef.fullPath)

    return { success: true, bucket: firebaseConfig.storageBucket, projectId: firebaseConfig.projectId }
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      bucket: firebaseConfig.storageBucket,
      projectId: firebaseConfig.projectId
    }
  }
}

export default app
