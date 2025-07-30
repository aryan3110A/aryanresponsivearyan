"use client"

import { useState, useEffect, type FormEvent, useRef } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, db } from "../../../database/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"
import { getImageUrl } from "@/routes/imageroute"
import { initializeTokens } from "@/app/utils/tokenManager"

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [timer, setTimer] = useState(0)
  const [username, setUsername] = useState("")
  const [showUsernameForm, setShowUsernameForm] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null) // Ref for hidden input

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      console.log("🧪 Testing Firebase connection...")
      console.log("📊 Firebase config:", {
        projectId: db.app.options.projectId,
        authDomain: db.app.options.authDomain,
        currentUser: auth.currentUser?.email || "Not authenticated"
      })

      // Try to read a test document (this will fail with permission error if rules are wrong)
      const testRef = doc(db, "test", "connection")
      await getDoc(testRef)
      console.log("✅ Firebase connection test successful")
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError
      console.error("❌ Firebase connection test failed:", {
        message: firebaseError.message,
        code: firebaseError.code,
        fullError: firebaseError
      })
    }
  }

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      setProcessing(true)
      await axios.post("http://localhost:5001/send-otp", { email })
      setOtpSent(true)
      setTimer(60)
    } catch (error) {
      const apiError = error as ApiError
      setError(apiError.message || 'Failed to send OTP')
      setProcessing(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      setProcessing(true)
      await axios.post("http://localhost:5001/verify-otp", {
        email,
        otp: otp.trim(),
      })

      localStorage.setItem("otpUser", email)
      console.log("📧 OTP verified for email:", email)

      const userRef = doc(db, "users", email)
      console.log("📄 Creating user document reference for:", email)

      console.log("🔍 Attempting to read user document (OTP flow)...")
      const userSnap = await getDoc(userRef)
      console.log("✅ User document read successful (OTP), exists:", userSnap.exists())

      if (userSnap.exists()) {
        const data = userSnap.data()
        console.log("📊 User data retrieved (OTP):", {
          hasUsername: !!data?.username,
          username: data?.username,
          email: data?.email
        })

        if (data.username) {
          localStorage.setItem("username", data.username)
          console.log("🏠 Redirecting to home page (OTP):", data.username)
          router.push(`/view/home/${data.username}`)
        } else {
          console.log("👤 User exists but no username (OTP), showing username form")
          setShowUsernameForm(true)
        }
      } else {
        console.log("🆕 User doesn't exist (OTP), creating new user document...")
        await setDoc(userRef, { email })
        console.log("✅ New user document created successfully (OTP)")
        setShowUsernameForm(true)
      }

      setOtp("")
      setOtpSent(false)
      setError("")
    } catch (err) {
      console.error("OTP verification error:", err)
      setError("Invalid OTP or expired.")
    } finally {
      setProcessing(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setProcessing(true)
      setError("")
      await axios.post("http://localhost:5001/send-otp", { email })
      setTimer(60)
    } catch {
      setError("Failed to resend OTP.")
    } finally {
      setProcessing(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log("🚀 Starting Google login process...")

      const provider = new GoogleAuthProvider()
      console.log("📱 Google provider created")

      const result = await signInWithPopup(auth, provider)
      console.log("✅ Google sign-in popup completed", {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      })

      const userEmail = result.user.email
      if (!userEmail) {
        console.error("❌ No email from Google user")
        throw new Error("No email from Google user")
      }

      console.log("📧 User email obtained:", userEmail)
      console.log("🔐 Auth state:", {
        currentUser: auth.currentUser?.email,
        isAuthenticated: !!auth.currentUser
      })

      localStorage.setItem("otpUser", userEmail)
      console.log("💾 Email saved to localStorage")

      const userRef = doc(db, "users", userEmail)
      console.log("📄 User document reference created for:", userEmail)

      console.log("🔍 Attempting to read user document...")
      const userSnap = await getDoc(userRef)
      console.log("✅ User document read successful, exists:", userSnap.exists())

      if (userSnap.exists()) {
        const data = userSnap.data()
        console.log("📊 User data retrieved:", {
          hasUsername: !!data?.username,
          username: data?.username,
          email: data?.email
        })

        if (data?.username) {
          localStorage.setItem("username", data.username)
          console.log("🏠 Redirecting to home page for existing user:", data.username)
          router.push(`/view/home/${data.username}`)
        } else {
          console.log("👤 User exists but no username, showing username form")
          setShowUsernameForm(true)
        }
      } else {
        console.log("🆕 User doesn't exist, creating new user document...")
        console.log("📝 Attempting to create user document with data:", { email: userEmail })

        await setDoc(userRef, { email: userEmail })
        console.log("✅ New user document created successfully")
        console.log("👤 Showing username form for new user")
        setShowUsernameForm(true)
      }
    } catch (err: unknown) {
      const error = err as FirebaseError
      console.error("❌ Google sign-in error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        fullError: error
      })

      // More specific error messages
      if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
        setError("Database permission error. Please contact support.")
        console.error("🔒 PERMISSION ERROR: Firestore rules may be too restrictive")
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.")
      } else if (error.code === 'auth/popup-blocked') {
        setError("Popup blocked. Please allow popups and try again.")
      } else {
        setError("Google sign-in failed. Please try again.")
      }
    }
  }

  const handleUsernameSubmit = async () => {
    try {
      const email = localStorage.getItem("otpUser")
      console.log("👤 Starting username submission for email:", email)

      if (email && username.trim()) {
        const realUsername = username.trim()
        const slug = `${realUsername.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(0, 6)}`

        console.log("📝 Username data prepared:", {
          email,
          username: realUsername,
          slug
        })

        console.log("💾 Attempting to update user document with username...")
        await setDoc(
          doc(db, "users", email),
          {
            email,
            username: realUsername,
            slug, // only used for routing
          },
          { merge: true },
        )
        console.log("✅ User document updated successfully with username")

        localStorage.setItem("username", realUsername)
        localStorage.setItem("slug", slug)
        console.log("💾 Username and slug saved to localStorage")

        // Initialize tokens for new user
        initializeTokens()
        console.log("🎫 Tokens initialized for new user")

        console.log("🏠 Redirecting to home page:", `/view/home/${slug}`)
        router.push(`/view/home/${slug}`)
      } else {
        console.error("❌ Missing email or username:", { email, username: username.trim() })
        setError("Missing email or username. Please try again.")
      }
    } catch (err: unknown) {
      const error = err as FirebaseError
      console.error("❌ Username submission error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        fullError: error
      })

      if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
        setError("Database permission error. Please contact support.")
        console.error("🔒 PERMISSION ERROR: Firestore rules may be too restrictive")
      } else {
        setError("Failed to save username. Please try again.")
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // Debug Firebase auth state on component mount
    console.log("🔐 Firebase Auth Debug:", {
      currentUser: auth.currentUser,
      isAuthenticated: !!auth.currentUser,
      projectId: db.app.options.projectId,
      authDomain: db.app.options.authDomain
    })

    // Test Firebase connection on mount
    testFirebaseConnection()

    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [otpSent, timer])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (otpSent && inputRef.current) {
      inputRef.current.focus()
    }
  }, [otpSent])

  return (
    <div className="min-h-screen p-6 bg-[#171717] text-white flex items-center justify-center">
      <div className="w-full p-6 space-y-6 space-x-4 bg-[#171717] rounded-xl shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Image src={getImageUrl('core','logo')} alt="WildMind Logo" width={48} height={48} className="w-12 h-12" />
          <h1 className="font-bold text-[25px]">WildMind</h1>
        </div>
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-[15px] font-light">Continue with</h1>
        </div>
        {showUsernameForm ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Create a Username</h2>
            <input
              type="text"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#2e2e2e] focus:outline-none"
            />
            <button onClick={handleUsernameSubmit} className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded">
              Save Username
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl text-center font-semibold">{otpSent ? "Enter OTP" : ""}</h2>

            <div className="space-y-2">
              <button
                onClick={handleGoogleLogin}
                className="w-[292.58px] h-[44px] max-w-full bg-[#26272C] text-white font-extralight pl-4 hover:bg-[#444D57] flex items-center justify-start gap-2 rounded-[8px]"
              >
                <Image src={getImageUrl('svgs','google')} alt="Google" width={20} height={20} className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button
                onClick={() => {}}
                className="w-[292.58px] h-[44px] bg-[#26272C] text-white font-extralight py-2 hover:bg-[#444D57] flex items-center justify-start pl-4 gap-2 rounded-[8px]"
              >
                <Image src={getImageUrl('svgs','apple')} alt="Apple" width={20} height={20} className="w-5 h-5" />
                <span>Apple</span>
              </button>
              <button
                onClick={() => {}}
                className="w-[292.58px] h-[44px] bg-[#26272C] text-white py-2 font-extralight hover:bg-[#444D57] flex items-center justify-start pl-4 gap-2 rounded-[8px]"
              >
                <Image src={getImageUrl('svgs','microsoft')} alt="Microsoft" width={20} height={20} className="w-5 h-5" />
                <span>Microsoft</span>
              </button>
            </div>
            <div className="w-[292.58px] flex items-center gap-2 my-4">
              <div className="flex-grow h-px bg-[#26272C]"></div>
              <span className="text-xs text-white bg-[#1B1F23] px-2 py-0.5 rounded-full">OR</span>
              <div className="flex-grow h-px bg-[#26272C]"></div>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 pt-4">
                <div>
                  <h1 className="text-white font-extralight">Email</h1>
                </div>
                <input
                  type="email"
                  placeholder="name@host.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full px-4 py-2 bg-[#111111] border border-[#464646] placeholder-[#9094A6] focus:outline-none rounded-[8px]"
                  required
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] py-2 rounded"
                >
                  {processing ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
                <div className="text-center space-y-1">
                  <p className="text-[17px] font-bold text-white">{email}</p>
                  <p className="text-xs text-[#A0A0A0]">
                    Enter the 4-digit OTP code that has been sent from SMS to complete your account registration
                  </p>
                </div>

                {/* Hidden input for full OTP entry */}
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setOtp(value)
                  }}
                  className="absolute opacity-0 pointer-events-none"
                  autoFocus
                />

                {/* 4-digit visual boxes */}
                <div className="flex justify-center gap-3 pt-4" onClick={() => inputRef.current?.focus()}>
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-14 flex items-center justify-center rounded-lg border transition-all duration-150 cursor-pointer ${
                        otp[idx]
                          ? "bg-[#111111] border-[#5AD7FF] text-white"
                          : "bg-[#111111] border-[#464646] text-[#5AD7FF]"
                      }`}
                      onClick={() => {
                        if (!otp[idx]) {
                          inputRef.current?.focus() // Focus the hidden input when clicking an empty box
                        }
                      }}
                    >
                      <span className="text-xl font-semibold">{otp[idx] || ""}</span>
                    </div>
                  ))}
                </div>

                {/* Timer and Resend */}
                <div className="text-center text-sm text-[#A0A0A0] pt-2">
                  Haven&apos;t got the confirmation code yet?{" "}
                  {timer === 0 ? (
                    <button type="button" onClick={handleResendOtp} className="text-blue-400 hover:underline">
                      Resend
                    </button>
                  ) : (
                    <span className="text-blue-400">Resend</span>
                  )}{" "}
                  {timer > 0 && <span>{timer}</span>}
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={processing || otp.length < 4}
                  className={`w-full py-2 rounded-[12px] ${
                    processing || otp.length < 4
                      ? "bg-[#3A3A3A] text-[#9B9B9B] cursor-not-allowed"
                      : "bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-white"
                  }`}
                >
                  {processing ? "Verifying..." : "Confirm"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Add interface for Firebase errors
interface FirebaseError {
  message: string;
  code?: string;
  stack?: string;
}

// Replace the any type with proper typing
interface ApiError {
  message: string;
  code?: string;
}
