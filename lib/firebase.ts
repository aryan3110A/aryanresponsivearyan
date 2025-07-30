import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
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

    // Try to get storage reference
    const { ref } = await import('firebase/storage')
    const testRef = ref(storage, 'test-connection.txt')
    console.log('✅ Firebase Storage reference created successfully')
    console.log('📍 Test reference path:', testRef.fullPath)

    return { success: true, bucket: firebaseConfig.storageBucket }
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      bucket: firebaseConfig.storageBucket
    }
  }
}

export default app
