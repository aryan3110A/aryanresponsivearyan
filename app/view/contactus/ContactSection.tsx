"use client";

import { useState } from "react";
import Image from "next/image";
// import Footer from "./Footer";
// import { db } from "@/lib/firebaseConfig"; // Ensure this path matches your folder structure



interface FormData {
  fullName: string;
  email: string;
  phone: string;
  option: string;
  message: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    option: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSelectedOption, setHasSelectedOption] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Handle form submission logic here
      console.log(formData);
      // Add your API call here

      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        option: "",
        message: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black to-black p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start ml-40">
          {/* Left Section (Fixed Position) */}
          <div className="text-white mt-28 self-start">
            <h2 className="text-2xl mb-2">Need immediate assistance?</h2>
            <p className="text-white mb-16">
              Let's make things happen—your goals, our expertise!
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-8">
              COME ON,
              <br />
              GIVE US A SHOUT!
            </h1>
          </div>

          {/* Right Section - Contact Form */}
          <div
            className={`backdrop-blur-xl bg-gradient-to-br from-[#282E32] via-[#374657] to-[#282E32] rounded-[3rem] p-14 shadow-[0_0_360px_50px_rgba(35,46,50,0.8)] mt-10 ml-16 w-[36rem] ${
              isDropdownOpen ? "h-[100%]" : "h-full"
            }`}
          >
            <h3 className="text-white text-2xl font-bold mb-1">Contact Form</h3>
            <p className="text-gray-300 text-xs mb-4">
              Fill out the form below, and our team will get back to you
              promptly. Let's connect and create solutions together!
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-2">
                <label className="text-white text-sm">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-12 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring focus:ring-[#5AD7FF]"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label className="text-white text-sm">
                  Business email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full h-12 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring focus:ring-[#5AD7FF]"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="mb">
                <label className="text-white text-sm">Phone</label>
                <div className="flex gap-2 ">
                  <select className="w-20 mt-2 bg-[#111111] text-white  rounded-lg px-2 text-sm">
                    <option className="text-sm">+91</option>
                  </select>
                  <input
                    type="tel"
                    className="flex-1 h-12 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring focus:ring-[#5AD7FF]"
                    placeholder="Enter your contact number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-2">
                <select
                  className={`w-[50%] h-10 bg-[#111111] text-white border border-gray-300 rounded-lg p-2 pl-4 text-sm mt-2 transition-all duration-300 ${
                    isDropdownOpen ? "mb-36" : "mb-2"
                  }`}
                  value={formData.option}
                  onChange={(e) => {
                    setFormData({ ...formData, option: e.target.value });
                    setHasSelectedOption(e.target.value !== ""); // Marks an option as selected
                    setIsDropdownOpen(false); // Closes dropdown after selection
                  }}
                  onFocus={() => {
                    if (!isDropdownOpen) {
                      setIsDropdownOpen(true); // Expands dropdown on first click
                    } else {
                      setIsDropdownOpen(false); // Collapses if clicked again without selecting
                    }
                  }}
                >
                  <option value="">Pick an option</option>
                  <option value="option1">General Inquiry</option>
                  <option value="option2">Support Request</option>
                  <option value="option3">Feature Suggestion</option>
                  <option value="option4">Business Collaboration</option>
                </select>
              </div>

              <div
                className={`mb-4 transition-all duration-300 ${
                  hasSelectedOption ? "mt-0" : isDropdownOpen ? "mt-36" : "mt-0"
                }`}
              >
                <label className="text-white text-sm transition-all">
                  How can we help you?
                </label>
                <textarea
                  className="w-full h-24 bg-[#111111] text-white rounded-lg p-2 pl-4 text-sm placeholder:text-[#FFFFFF99] mt-2 focus:outline-none focus:ring focus:ring-[#5AD7FF] mb-2"
                  placeholder="Enter your message here"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-[22rem] w-28 h-12 bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] 
             text-white rounded-full py-2 px-6 transition-all 
             hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed 
             hover:shadow-[0_0_10px_5px_rgba(101,107,245,0.8)]"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

        {/* Rating Section */}
        <div
          className="relative mt-40 text-center text-white "
          style={{
            backgroundImage: "url('/bg_rating7.png')",
            backgroundSize: "contain", // Ensures the image maintains its original size
            backgroundRepeat: "no-repeat", // Prevents repeating of the image
            backgroundPosition: "center", // Centers the image
            width: "100%", // Full width
            height: "800px", // Replace with the actual height of your image
            opacity: "",
          }}
        >
          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            {/* Glowing Effect for Icon */}
            <div className="inline-block rounded-full mb-0 p-4">
              <Image
                src="/rateicon.png"
                alt="Mobile App"
                width={128}
                height={128}
                className="w-32 h-32 object-contain rounded-full "
              />
            </div>

            {/* Rating Heading */}
            <h3 className="text-2xl mb-4">
              How do you rate
              <br />
              Your app experience?
            </h3>

            {/* Star Rating */}
            <div className="-mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-yellow-400 text-[4rem]">
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Background Overlay to Improve Visibility */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>

        {/* Newsletter Section */}
        <div className="w-full bg-black py-12  mt-40 mb-10">
          <div className="max-w-6xl mx-auto ml-24 flex flex-col md:flex-row justify-between items-center gap-6 px-0">
            {/* Left side - Heading */}
            <div>
              <h2 className="  text-white text-2xl md:text-3xl font-semibold leading-tight">
                Join our newsletter to
                <br />
                keep up to date with us!
              </h2>
            </div>

            {/* Right side - Form */}
            <div className=" w-full md:w-auto ">
              <form className="-mr-[18.5rem] flex gap-4">
                <div className="flex-grow relative max-w-md">
                  {" "}
                  {/* Increased width */}
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-[24rem] bg-transparent border border-[#282E32] rounded-full py-3 px-12 ml-16 text-white placeholder-gray-400 focus:outline-none focus:border-[#5AD7FF]"
                    required
                  />
                  <span className="absolute left-20 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />{" "}
                    </svg>
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full font-medium text-white transition-colors 
             bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] 
             hover:bg-white hover:text-black hover:from-white hover:to-white"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className=" border-t border-[#FFFFFF52] mx-[6rem] "></div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ContactSection;
