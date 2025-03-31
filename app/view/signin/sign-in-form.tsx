"use client";

import { useState, FormEvent, useRef } from "react";
import Link from "next/link";
import { FaDiscord, FaInstagram, FaYoutube, FaBlog } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  // Instead of a single OTP string, we use an array of 6 digits:
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Create refs for each OTP input to enable auto-focus
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Handler to send OTP
  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      setProcessing(true);
      await axios.post("http://localhost:5001/send-otp", { 
        email: formData.email, 
        password: formData.password 
      });
      setOtpSent(true);
    } catch (err) {
      console.error("Error sending OTP", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Handler for OTP digit change
  const handleDigitChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) { // allow only one digit
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);
      // Auto-focus next input if available and current value is non-empty
      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  // Handler for key down (to navigate with backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handler to verify OTP and register/sign in user with Firebase
  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      setProcessing(true);
      const combinedOtp = otpDigits.join("");
      await axios.post("http://localhost:5001/verify-otp", { 
        email: formData.email, 
        otp: combinedOtp 
      });
      console.log("OTP verified on backend.");

      // Attempt to create the user in Firebase
      try {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("User created in Firebase.");
      } catch (firebaseError: unknown) {
        // If user already exists, sign them in instead
        if (
          firebaseError instanceof Error &&
          (firebaseError.message.includes('auth/email-already-in-use') ||
           firebaseError.message.includes('auth/email-exists'))
        ) {
          console.log("User already exists. Signing in...");
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
        } else {
          throw firebaseError;
        }
      }
      router.push("/view/home");
    } catch (err) {
      console.error("OTP verification or registration failed:", err);
      setError("Invalid OTP or registration error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#000] relative overflow-hidden px-6 lg:px-8 py-12 flex flex-col justify-between">
      <div className="radial-gradient absolute w-[335px] h-[354px] top-[-37px] left-[42px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="w-[149px] h-[55px] -mt-6 text-center">
          <span className="text-gray-300 text-3xl font-semibold">Logo</span>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-[320px] space-y-8">
          <div className="text-center">
            <h2 className="text-gray-300 text-lg font-light text-[16px]">
              {otpSent ? "Enter OTP" : "Sign In / Sign Up"}
            </h2>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="space-y-4 -mt-10">
                <div>
                  <label className="block text-gray-300 text-base font-light mb-2 text-[16px]">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@host.com"
                    className="w-full h-10 bg-[#262626] border-none rounded-lg px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] opacity-90 transition-all duration-300"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-base font-light mb-2 text-[16px]">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-10 bg-[#262626] border-none rounded-lg px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] opacity-90 transition-all duration-300"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-sm font-light text-[14px]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={processing}
                className="w-full h-12 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg transition-opacity font-light flex items-center justify-center text-[16px] hover:shadow-[0_0_10px_#5e81ff] mt-4"
              >
                {processing ? "Processing..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <p className="text-gray-300 text-sm font-light text-[14px]">
                We have sent an OTP to: <strong>{formData.email}</strong>
              </p>
              {/* 6 columns for OTP digits */}
              <div className="flex justify-center space-x-2 mt-4">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 text-center bg-[#262626] border-none rounded-lg px-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#444c55] transition-all duration-300"
                    value={otpDigits[index]}
                    onChange={(e) => handleDigitChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={inputRefs[index]}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm font-light text-[14px]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={processing}
                className="w-full h-12 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg transition-opacity font-light flex items-center justify-center text-[16px] hover:shadow-[0_0_10px_#28a745] mt-4"
              >
                {processing ? "Processing..." : "Verify OTP and Register"}
              </button>
            </form>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 justify-center mt-32">
          <div className="p-3 rounded-full border-white bg-transparent transition-all duration-300">
            <FaDiscord className="text-white text-3xl transition-all duration-300 hover:text-discord hover:drop-shadow-[0_0_10px_#8893f7]" />
          </div>
          <div className="p-3 rounded-full border-white bg-transparent transition-colors duration-300">
            <FaInstagram className="text-white text-3xl transition-colors duration-300 hover:text-instagram hover:drop-shadow-[0_0_10px_#f28ea7]" />
          </div>
          <div className="p-3 rounded-full border-white bg-transparent transition-colors duration-300">
            <FaYoutube className="text-white text-3xl transition-colors duration-300 hover:text-youtube hover:drop-shadow-[0_0_10px_#ff7373]" />
          </div>
          <div className="p-3 rounded-full border-white bg-transparent transition-colors duration-300">
            <FaBlog className="text-white text-3xl transition-colors duration-300 hover:text-green-500 hover:drop-shadow-[0_0_10px_#77e588]" />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <Link href="#" className="hover:text-gray-400 hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-gray-400 hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
