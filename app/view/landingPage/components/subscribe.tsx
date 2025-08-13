'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import CardSwap, { Card } from './CardSwap';
import { ChevronRight, Check } from 'lucide-react';

interface NewsletterSignupProps {
  onSubmit?: (email: string) => void
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('')
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const isReady = useMemo(() => email.trim().length > 0 && isChecked, [email, isChecked])
  const showPolicyHint = useMemo(() => email.trim().length > 0 && !isChecked, [email, isChecked])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isReady) return

    try {
      setStatus('loading')
      const maybePromise = onSubmit?.(email)
      if (maybePromise && typeof (maybePromise as any).then === 'function') {
        await (maybePromise as Promise<unknown>)
      } else {
        // Fallback artificial delay to show spinner if no async handler provided
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }
      setStatus('success')
      // Optional: revert back to idle after a brief success state
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      // In case of error, just return to idle so user can retry
      setStatus('idle')
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
                aria-invalid={showPolicyHint}
                className={`w-full bg-white/5 border backdrop-blur-sm text-white rounded-full px-4 py-3 pr-12 placeholder-gray-300 shadow-inner focus:outline-none transition-all duration-300
                  ${showPolicyHint ? 'border-red-400/60 focus:ring-2 focus:ring-red-400/40 focus:border-red-400/60' : 'border-white/20 focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:bg-white/10'}
                `}
              />
              <button
                type="submit"
                disabled={!isReady || status === 'loading'}
                aria-label="Submit email"
                className={`flex items-center justify-center w-9 h-9 rounded-full absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none transition-colors duration-200
                  ${status === 'loading' ? 'cursor-wait' : 'cursor-pointer'}
                  ${isReady ? 'bg-white text-black shadow-md hover:bg-white/90' : 'bg-white/20 text-white/60'}
                `}
              >
                {status === 'loading' ? (
                  <span className="inline-block w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                ) : status === 'success' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
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

            {showPolicyHint && (
              <p className="text-xs text-red-400">
                Please agree to the Privacy Policy to continue.
              </p>
            )}

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
                src="/Landingpage/animated-tabs/updates.png"
                alt="Updates"
                width={320}
                height={200}
                className="flex-1 w-full object-cover bg-transparent"
              />
            </Card>

            <Card className="bg-black/20 p-0 rounded-[12px] bg-[#0F0F10] border border-[#1F1F22] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] w-[320px] h-[200px] overflow-hidden flex flex-col">
              <div className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-[#19191B] to-[#121213] border-b border-[#2C2C2E]">
                Promotional Deals
              </div>
              <Image
                src="/Landingpage/animated-tabs/promo.png"
                alt="Promotions"
                width={320}
                height={200}
                className="flex-1 w-full object-cover bg-transparent"
              />
            </Card>

            <Card className="bg-black/20 p-0 rounded-[12px] bg-[#0F0F10] border border-[#1F1F22] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] w-[320px] h-[200px] overflow-hidden flex flex-col">
              <div className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-[#19191B] to-[#121213] border-b border-[#2C2C2E]">
                Newsletter
              </div>
              <Image
                src="/Landingpage/animated-tabs/neswsl.png"
                alt="Newsletter"
                width={320}
                height={200}
                className="flex-1 w-full object-cover bg-[#fff8eb]"
              />
            </Card>

          </CardSwap>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSignup
