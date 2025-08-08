'use client'

import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import CardSwap, { Card } from './CardSwap'
import Image from 'next/image'

interface NewsletterSignupProps {
  onSubmit?: (email: string) => void
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [isChecked, setIsChecked] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(email)
    }
  }

  return (
    <div className="relative z-0 mb-4 max-w-7xl mx-auto text-white p-6 sm:p-10 rounded-3xl border border-white/20 backdrop-blur-lg bg-gradient-to-br from-white/5 to-transparent shadow-2xl overflow-hidden">
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
        {/* Left: Form */}
        <div className="flex-1 space-y-6 w-full -mt-28 md:-mt-44">
          <div className="space-y-3">
            <span className="uppercase text-sm text-gray-300 tracking-widest">Newsletter Signup</span>
            <h2 className="text-3xl md:text-4xl font-bold drop-shadow-md">
              Subscribe for<br />the updates!
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex items-center w-full">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/20 backdrop-blur-sm text-white rounded-full px-4 py-3 pr-12 placeholder-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/10 transition-all duration-300"
              />
              <button
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/33 shrink-0 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <label className="flex items-start space-x-3 text-gray-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                required
                className="accent-white w-4 h-4 mt-1"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="underline hover:text-white transition">
                  Privacy Policy
                </a>.
              </span>
            </label>

          </form>
        </div>

        {/* Right: CardStack animation (fixed layout and height) */}
        <div className="flex-1 flex items-center justify-center relative min-h-[480px]">
          <CardSwap
            cardDistance={50}
            verticalDistance={80}
            delay={3500}
            pauseOnHover={false}
            skewAmount={5}
          >
              <Card className="bg-black/20 p-0 rounded-[12px] bg-[#0F0F10] border border-[#1F1F22] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] w-[320px] h-[200px] overflow-hidden flex flex-col">
              <div className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-[#19191B] to-[#121213] border-b border-[#2C2C2E]">
                Updates
              </div>
              <Image
                src="/Landingpage/animated-tabs/imagegen.png"
                alt="Updates"
                width={320}
                height={200}
                className="flex-1 w-full object-contain bg-transparent"
              />
            </Card>

            <Card className="bg-black/20 p-0 rounded-[12px] bg-[#0F0F10] border border-[#1F1F22] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] w-[320px] h-[200px] overflow-hidden flex flex-col">
              <div className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-[#19191B] to-[#121213] border-b border-[#2C2C2E]">
                Promotional Deals
              </div>
              <Image
                src="/Landingpage/animated-tabs/audio.png"
                alt="Promotions"
                width={320}
                height={200}
                className="flex-1 w-full object-contain bg-transparent"
              />
            </Card>

            <Card className="bg-black/20 p-0 rounded-[12px] bg-[#0F0F10] border border-[#1F1F22] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] w-[320px] h-[200px] overflow-hidden flex flex-col">
              <div className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-[#19191B] to-[#121213] border-b border-[#2C2C2E]">
                Newsletter
              </div>
              <Image
                src="/Landingpage/animated-tabs/3D.png"
                alt="Newsletter"
                width={320}
                height={200}
                className="flex-1 w-full object-contain bg-transparent"
              />
            </Card>

          </CardSwap>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSignup
