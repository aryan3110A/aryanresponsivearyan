"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Footer from "../Core/Footer"
import { getImageUrl } from "@/routes/imageroute";


const scriptURL =
  "https://script.google.com/macros/s/AKfycbz0dKO8m-4_vrGpnaPI4zP01OkoN5uXxo1DrJ9jY_oz5tsoNUYvtxxNKgvdYMiZUGsWBw/exec"

interface FormData {
  fullName: string
  email: string
  phone: string
  option: string
  message: string
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    option: "",
    message: "",
  })

  const [rating, setRating] = useState<number>(0)
  const handleRatingClick = (star: number) => {
    if (rating === star) {
      setRating(0) // If the same star is clicked, reset to 0 (unselect)
    } else {
      setRating(star) // Otherwise, update to the clicked star
    }
  } // State inside the component

  const [newsletterEmail, setNewsletterEmail] = useState("") // Newsletter state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hasSelectedOption, setHasSelectedOption] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  // Handle Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)
    setFormErrors({})

    const errors: { email?: string; phone?: string } = {}
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Enter a valid email address."
    }
    if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits."
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      const form = new FormData()
      form.append('Name', formData.fullName)
      form.append('Email', formData.email)
      form.append('Phone', formData.phone)
      form.append('Option', formData.option)
      form.append('Message', formData.message)

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: form
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setSuccessMessage("Your form has been submitted successfully! Our team will reach out to you soon.")
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        option: "",
        message: "",
      })
    } catch (error) {
      setError("Something went wrong. Please try again.")
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Newsletter Subscription
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNewsletterError(null)
    setNewsletterMessage(null)

    if (!newsletterEmail.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setNewsletterError("Please enter a valid email address.")
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("NewsLetterEmail", newsletterEmail)

      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit to Google Sheets")
      }

      setNewsletterMessage("You have successfully subscribed to our newsletter!")
      setNewsletterEmail("")
    } catch (err) {
      setNewsletterError("Failed to subscribe. Please try again.")
      console.error("Error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const form = document.querySelector('form[name="submit-to-google-sheet"]') as HTMLFormElement | null;
    // document.documentElement.style.overflow = "hidden"; // Hide scrolling

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        fetch(scriptURL, { method: "POST", body: new FormData(form) })
          .then((response) => console.log("Success!", response))
          .catch((error) => console.error("Error!", error.message))
      })
    }
  }, [])

  const [formErrors, setFormErrors] = useState<{
    email?: string
    phone?: string
  }>({})

  return (
    <>
    
      <div className="min-h-screen bg-gradient-to-br from-black to-black  pt-16">
        
        <div className="flex justify-evenly">
          {/* Left Section (Fixed Position) */}
          <div className="text-white mt-28 self-start ">
            <h2 className="text-white text-2xl mb-2">Need immediate assistance?</h2>
            <p className="sm:text-lg text-white lg:text-lg mb-16">
              Let&apos;s make things happen—your goals, our expertise!
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-8">
              COME ON,
              <br />
              GIVE US A SHOUT!
            </h1>
          </div>

          {/* Right Section - Contact Form */}
          <div
            className={`backdrop-blur-3xl  bg-gradient-to-br from-[#262B30] via-[#3B4C5E] to-[#262B30] rounded-[3rem] p-14 shadow-[0_0_300px_80px_rgba(35,46,50,0.8)] mt-10 w-[36rem] ${
              isDropdownOpen ? "h-[100%]" : "h-[95%]"
            }`}
          >
            <h3 className="text-white text-2xl lg:text-3xl font-bold mb-1">Contact Form</h3>
            <p className="text-gray-300 text-sm lg:text-sm mb-4">
              Fill out the form below, and our team will get back to you promptly. Let&apos;s connect and create solutions
              together!
            </p>

            <form ref={formRef} onSubmit={handleContactSubmit} className="space-y-2" name="submit-to-google-sheet">
              {successMessage && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-md mb-4">
                  {successMessage}
                </div>
              )}
              {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md">{error}</div>}

              <div className="mb-2">
                <label className="text-white text-sm">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Name"
                  className="w-full h-12 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] opacity-90 transition-all duration-300"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="text-white text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="Email"
                  className="w-full h-12 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] opacity-90 transition-all duration-300"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div className="mb">
      <label className="text-white text-sm">Phone</label>
      <div className="flex gap-2 ">
        <select
          className="w-40 mt-2 bg-[#111111] text-white rounded-lg px-2 text-sm 
          max-h-60 focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] opacity-90 
          transition-all duration-300 overflow-y-auto scrollbar-none "
          size={1} // Keeps it looking like a normal dropdown
        >
          <option value="+91">+91 (India)</option>
          <option value="+1">+1 (USA/Canada)</option>
          <option value="+44"> +44 (UK)</option>
          <option value="+61"> +61 (Australia)</option>
          <option value="+971"> +971 (UAE)</option>
          <option value="+49">+49 (Germany)</option>
          <option value="+33">+33 (France)</option>
          <option value="+81"> +81 (Japan)</option>
          <option value="+86"> +86 (China)</option>
          <option value="+7"> +7 (Russia)</option>
          <option value="+39"> +39 (Italy)</option>
          <option value="+55"> +55 (Brazil)</option>
          <option value="+34">+34 (Spain)</option>
          <option value="+27">+27 (South Africa)</option>
          <option value="+62">+62 (Indonesia)</option>
          <option value="+82">+82 (South Korea)</option>
          <option value="+52"> +52 (Mexico)</option>
          <option value="+31">+31 (Netherlands)</option>
          <option value="+46"> +46 (Sweden)</option>
          <option value="+41"> +41 (Switzerland)</option>
          <option value="+65"> +65 (Singapore)</option>
          <option value="+20"> +20 (Egypt)</option>
        </select>

        <input
          type="tel"
          name="Phone"
          className="flex-1 h-12 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm 
          placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring-2 focus:ring-[#444c55] 
          text-[15px] opacity-90 transition-all duration-300"
          placeholder="Enter your contact number"
          value={formData.phone}
          onChange={(e) => {
            const newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            if (newValue.length <= 10) {
              setFormData({ ...formData, phone: newValue });
            }
          }}
          required
        />
      </div>
      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
    </div>

              <div className="mt-2">
                <div
                  ref={dropdownRef}
                  className={`w-[50%] h-10 bg-[#111111] text-white border border-gray-300 rounded-lg p-2 pl-4 text-sm mt-2 transition-all duration-200 ${
                    isDropdownOpen ? "mb-48" : "mb-2"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent the click from immediately closing the dropdown
                    if (!isDropdownOpen && !hasSelectedOption) {
                      setIsDropdownOpen(true)
                    } else {
                      setIsDropdownOpen(false)
                      setHasSelectedOption(false)
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {formData.option === ""
                        ? "Pick an option"
                        : formData.option === "option1"
                          ? "General Inquiry"
                          : formData.option === "option2"
                            ? "Support Request"
                            : formData.option === "option3"
                              ? "Feature Suggestion"
                              : "Business Collaboration"}
                    </span>
                    <span>▼</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute w-[40%] bg-[#111111] border border-gray-300 rounded-lg mt-4 z-10 -ml-4">
                      <div
                        className="p-2 pl-4 hover:bg-[#222222] cursor-pointer border-b border-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, option: "" })
                          setHasSelectedOption(true)
                          setIsDropdownOpen(false)
                        }}
                      >
                        Pick an option
                      </div>
                      <div
                        className="p-2 pl-4 hover:bg-[#222222] cursor-pointer border-b border-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, option: "option1" })
                          setHasSelectedOption(true)
                          setIsDropdownOpen(false)
                        }}
                      >
                        General Inquiry
                      </div>
                      <div
                        className="p-2 pl-4 hover:bg-[#222222] cursor-pointer border-b border-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, option: "option2" })
                          setHasSelectedOption(true)
                          setIsDropdownOpen(false)
                        }}
                      >
                        Support Request
                      </div>
                      <div
                        className="p-2 pl-4 hover:bg-[#222222] cursor-pointer border-b border-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, option: "option3" })
                          setHasSelectedOption(true)
                          setIsDropdownOpen(false)
                        }}
                      >
                        Feature Suggestion
                      </div>
                      <div
                        className="p-2 pl-4 hover:bg-[#222222] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, option: "option4" })
                          setHasSelectedOption(true)
                          setIsDropdownOpen(false)
                        }}
                      >
                        Business Collaboration
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`mb-4 transition-all duration-300 ${
                  hasSelectedOption ? "mt-0" : isDropdownOpen ? "mt-36" : "mt-0"
                }`}
              >
                <label className="text-white text-sm transition-all">How can we help you?</label>
                <textarea
                  className="w-full h-24 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] opacity-90 transition-all duration-300"
                  placeholder="Enter your message here"
                  value={formData.message}
                  name="Message"
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-[22rem] w-28 h-12 bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] 
                text-white rounded-full py-2 px-6 transition-all 
                hover:opacity-100 hover:shadow-[0_0_10px_5px_rgba(101,107,245,0.8)]
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* Rating Section */}
        <div
          className="relative mt-40 text-center text-white w-[100vw] "
          style={{
            backgroundImage: `url(${getImageUrl('contactus', 'bg_rating')})`,
            backgroundSize: "contain", // Ensures the image maintains its original size
            backgroundRepeat: "no-repeat", // Prevents repeating of the image
            backgroundPosition: "center", // Centers the image
            width: "100%", // Full width
            height: "100vh", // Replace with the actual height of your image
            opacity: "",
          }}
        >
          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            {/* Glowing Effect for Icon */}
            <div className="inline-block rounded-full mb-0 p-4">
              <Image
                src={getImageUrl('contactus', 'rateicon')}
                alt="Mobile App"
                width={128}
                height={128}
                className="w-32 h-32 object-contain rounded-full "
              />
            </div>

            {/* Rating Heading */}
            {/* Rating Heading */}
            <h3 className="text-2xl mb-4">
              How do you rate
              <br />
              Your app experience?
            </h3>

            {/* Star Rating */}
            <div className="-mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`text-[4rem] transition-all duration-200 ${
                    star <= rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Background Overlay to Improve Visibility */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>

        {/* Newsletter Section */}
        <div className="md:w-[86%] lg:w-[95%] bg-black py-12 mt-10 md:mt-10 lg:mt-10 md:mb-0 lg:mb-4 md:ml-16 lg:-ml-36">
  <div className="max-w-[1440px] md:mx-auto lg:mx-auto md:px-8 lg:px-8 flex flex-row md:flex-row justify-between items-center gap-6 lg:gap-16">
    
    {/* Left side - Heading (Now moved to the start for lg:) */}
    <div className="text-center md:text-left lg:text-left lg:self-start lg:mr-auto">
      <h2 className="text-white text-2xl md:text-3xl lg:text-3xl font-semibold leading-tight lg:leading-1.2">
        Join our newsletter to
        <br />
        keep up to date with us!
      </h2>
    </div>







    {/* Right side - Form */}
    <div className="w-full md:w-auto lg:w-auto lg:-mr-[19rem]">
      <form
        onSubmit={handleNewsletterSubmit}
        className="flex flex-col md:flex-row gap-12 lg:gap-14 w-full max-w-2xl"
        name="submit-to-google-sheet"
      >
        <div className="flex-grow relative w-[22rem] lg:w-[28rem]">
          <input
            type="email"
            name="NewsLetterEmail"
            placeholder="Enter your email"
            className="w-[110%] bg-transparent border border-[#414141] rounded-full py-3 px-12 text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#444c55] text-[15px] lg:text-[1rem] opacity-90 transition-all duration-300"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-6 h-6 lg:w-6 lg:h-6   text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 -mr-20 w-[8rem] lg:w-[10rem] rounded-full font-medium text-white transition-colors 
            bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] 
            hover:bg-white hover:text-black hover:from-white hover:to-white
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
            </div>
          </div>

          {/* Message Display */}
          <div className="flex justify-end mr-[13.2rem] text-sm sm:mr-[7rem] lg:mr-[3.4rem]">
            {newsletterMessage && (
              <div className="bg-green-500/0   text-green-500   text-center mt-2">
                {newsletterMessage}
              </div>
            )}
            {newsletterError && (
              <div className="md:-mr-[3rem] lg:mr-[4.5rem]  bg-green-500/0   text-red-500   text-center mt-2">
                {newsletterError}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-[#FFFFFF52] w-[86%] md:w-[87%] lg:w-[93%] mx-auto"></div>
      </div>
            <Footer />
    </>
  );
};

export default ContactSection;
