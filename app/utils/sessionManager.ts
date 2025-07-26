import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/database/firebase"
import { signOut } from "firebase/auth"
import { auth } from "@/database/firebase"

export const startSessionMonitoring = (email: string) => {
  const userRef = doc(db, "users", email)
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data()
      const storedSessionId = localStorage.getItem("sessionId")
      
      // If session IDs don't match, user was logged in elsewhere
      if (userData.sessionId !== storedSessionId) {
        handleSessionInvalidated()
      }
    }
  })
}

const handleSessionInvalidated = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
  }
  
  // Clear all session data
  localStorage.removeItem("sessionId")
  localStorage.removeItem("otpUser")
  localStorage.removeItem("username")
  localStorage.removeItem("slug")
  
  // Redirect to login
  window.location.href = "/view/signup"
  
  // Show notification
  alert("You have been logged out because your account was accessed from another device.")
}

export const validateCurrentSession = async (email: string): Promise<boolean> => {
  const storedSessionId = localStorage.getItem("sessionId")
  if (!storedSessionId) return false
  
  const userRef = doc(db, "users", email)
  const userSnap = await getDoc(userRef)
  
  if (userSnap.exists()) {
    const userData = userSnap.data()
    return userData.sessionId === storedSessionId
  }
  
  return false
}