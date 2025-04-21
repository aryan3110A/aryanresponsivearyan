"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import Image from "next/image"
import Footer from "../Core/Footer"
import Link from "next/link"
import { NAV_ROUTES, FEATURE_ROUTES } from "../../../routes/routes"
import { getImageUrl } from "@/routes/imageroute"
import Navigation from "../landingPage/components/Navigation"
import NavigationFull from "../Core/NavigationFull"

type BillingPeriod = "monthly" | "yearly"

interface PlanFeature {
  text: string
}

interface PricingPlan {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: PlanFeature[]
  isCurrent?: boolean
  fastGenerations: string
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Basic Plan",
    monthlyPrice: 0,
    yearlyPrice: 0,
    fastGenerations: "30h",
    isCurrent: true,
    features: [
      { text: "Unlimited Relaxed generations" },
      { text: "General commercial terms" },
      { text: "Access to member gallery" },
      { text: "Optional credit top ups" },
      { text: "3 concurrent fast jobs" },
      { text: "12 concurrent fast jobs" },
      { text: "Access to member gallery" },
      { text: "Optional credit top ups" },
    ],
  },
  {
    name: "Stander Plan",
    monthlyPrice: 30,
    yearlyPrice: 24,
    fastGenerations: "30h",
    features: [
      { text: "Unlimited Relaxed generations" },
      { text: "General commercial terms" },
      { text: "Access to member gallery" },
      { text: "Optional credit top ups" },
      { text: "3 concurrent fast jobs" },
      { text: "12 concurrent fast jobs" },
      { text: "Access to member gallery" },
      { text: "Optional credit top ups" },
    ],
  },
  {
    name: "Pro Plan",
    monthlyPrice: 60,
    yearlyPrice: 48,
    fastGenerations: "30h",
    features: [
      { text: "Unlimited Relaxed generations" },
      { text: "General commercial terms" },
      { text: "Access to member gallery" },
      { text: "Optional credit top ups" },
      { text: "3 concurrent fast jobs" },
    ],
  },
  {
    name: "Unlimited Plan",
    monthlyPrice: 120,
    yearlyPrice: 96,
    fastGenerations: "60h",
    features: [
      { text: "Unlimited Relaxed generations" },
      { text: "General commercial terms" },
      { text: "Access to member gallery" },
      { text: "Optional credit top ups" },
      { text: "3 concurrent fast jobs" },
      { text: "12 concurrent fast jobs" },
    ],
  },
]

export default function SubscriptionToggle() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")
  const [animateToggle, setAnimateToggle] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLaptopOrLarger, setIsLaptopOrLarger] = useState(false)

  // For mobile slider
  const sliderRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkScreenSize = () => {
      setIsLaptopOrLarger(window.innerWidth >= 1024) // Tailwind's lg breakpoint = 1024px
    }

    // Initial check
    checkMobile()
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const handleToggle = (period: BillingPeriod) => {
    if (period !== billingPeriod) {
      setAnimateToggle(true)
      setBillingPeriod(period)
    }
  }

  useEffect(() => {
    if (animateToggle) {
      const timer = setTimeout(() => {
        setAnimateToggle(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [animateToggle])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === pricingPlans.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? pricingPlans.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <>
      {isLaptopOrLarger ? <NavigationFull /> : <Navigation />}

      <div className="min-h-screen relative text-white p-4 md:p-10 flex flex-col items-center justify-center overflow-hidden">
        {/* Mobile Navigation */}
        {isMobile && (
          <div className="fixed top-0 left-0 w-full z-[1000] bg-black/80 backdrop-blur-xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Image
                  src={getImageUrl("core", "logo") || "/Core/Logomain.png"}
                  width={30}
                  height={30}
                  alt="WildMind Logo"
                />
                <span className="ml-2 text-xl font-bold">WildMind</span>
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {isMobileMenuOpen && (
              <Navigation />
            )}
          </div>
        )}

        {/* Desktop Navigation */}
        {!isMobile && !isLaptopOrLarger && (
          <div
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between p-2 rounded-[50px] 
            border-[1px] border-white/20 w-[45vw] text-white backdrop-blur-xl bg-black/10 shadow-lg transition-all duration-300"
          >
            {/* Logo */}
            <div>
              <span className="">
                <Image src="/Core/Logomain.png" width={40} height={40} alt="Main Logo" />
              </span>
            </div>

            {/* Navigation Links */}
            <div>
              <span className="px-3 py-1 hover:bg-gradient-to-l hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]">
                Features
              </span>
            </div>
            <div>
              <span className="px-3 py-1 hover:bg-gradient-to-l hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]">
                Templates
              </span>
            </div>
            <div>
              <span className="px-3 py-1 hover:bg-gradient-to-l hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]">
                Pricing
              </span>
            </div>
            <div>
              <span className="px-3 py-1 hover:bg-gradient-to-l hover:bg-clip-text cursor-pointer hover:text-[#dbdbdb]">
                Art Station
              </span>
            </div>

            {/* Get Started Button */}
            <div>
              <button
                className="relative bg-black/20 border border-white/20 rounded-full px-5 py-2 text-base font-medium border-t-[#acacac] border-b-[#6A0DAD] hover:border-t-[#6A0DAD] hover:border-b-[#acacac] 
                          text-transparent bg-clip-text bg-gradient-to-r from-[#5AD7FF] to-[#656BF5] shadow-[inset_0px_0px_8px_rgba(255,255,255,0.2)] 
                          transition-all duration-500 ease-in-out hover:text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <Image
            src="/plans/IMAGE.png"
            alt="Background gradient"
            className="w-full h-full object-cover opacity-50"
            width={1920}
            height={1080}
          />
        </div>

        <div className="relative z-10 w-full max-w-[90%] mt-16 md:mt-0">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 mt-10">Purchase a subscription</h1>
            <p className="text-lg md:text-xl text-[#FFFFFF]">Choose the plan that works for you.</p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-8 md:mb-16">
            <div className="relative bg-[#FFFFFF] rounded-full p-1 flex w-[74%] md:w-[25%] h-[3rem] md:h-[3.8rem]">
              {/* Animated Background */}
              <div
                className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] transition-all duration-300 ease-in-out ${
                  billingPeriod === "monthly" ? "left-1 right-[calc(55%+1px)]" : "left-[calc(45%+1px)] right-1"
                }`}
              ></div>

              {/* Monthly Button */}
              <button
                onClick={() => handleToggle("monthly")}
                className={`flex-1 relative z-10 py-2 rounded-full text-center text-base md:text-lg transition-colors ${
                  billingPeriod === "monthly" ? "text-white" : "text-[#1D2127]"
                }`}
              >
                Monthly
              </button>

              {/* Yearly Button */}
              <button
                onClick={() => handleToggle("yearly")}
                className={`flex-1 relative z-10 py-2 rounded-full text-center text-base md:text-lg transition-colors ${
                  billingPeriod === "yearly" ? "text-white" : "text-[#1D2127]"
                }`}
              >
                Yearly <span className="text-xs md:text-sm text-emerald-300">-20% off</span>
              </button>
            </div>
          </div>

          {/* Desktop Pricing Cards */}
          {!isMobile && (
            <div className="m-4 p-4 rounded-3xl w-full bg-[linear-gradient(to_bottom,black_60%,gray_100%,white_100%)]">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 relative z-10">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`bg-black text-white backdrop-blur-sm border rounded-3xl p-6 flex flex-col h-full transition-all duration-300 ${
                      selectedPlan === index ? "border-white" : "border-none"
                    }`}
                    onClick={() => setSelectedPlan(index)}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-2 mt-2">{plan.name}</h2>
                      <div className="flex mt-4">
                        <span className="text-4xl font-bold">
                          ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="mt-0 ml-2 text-sm text-gray-400">
                          per editor/
                          {billingPeriod === "monthly" ? "month" : "month"}
                          <br />
                          billed {billingPeriod}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-grow">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 rounded-full bg-[#35F148] p-1">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                        <span className="text-sm">{plan.fastGenerations} Fast generations</span>
                      </div>

                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2 ">
                          <div className="mt-1 flex-shrink-0 rounded-full bg-[#35F148] p-1">
                            <Check className="h-3 w-3 text-black" />
                          </div>
                          <span className="text-sm font-poppins font-thin mt-1 ">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`mt-6 py-3 px-4 rounded-xl text-center text-lg w-full ${
                        plan.isCurrent
                          ? "bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                          : "bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-white transition-colors"
                      }`}
                    >
                      {plan.isCurrent ? "Current Plan" : "Choose Plan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Pricing Cards with Slider */}
          {isMobile && (
            <div className="relative w-full px-2">
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 rounded-full p-1"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 rounded-full p-1"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slider Container */}
              <div ref={sliderRef} className="overflow-hidden rounded-3xl border border-gray-800">
                {/* Current Plan Card */}
                <div className="bg-black text-white backdrop-blur-sm p-6 flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">{pricingPlans[currentSlide].name}</h2>
                    <div className="flex mt-2">
                      <span className="text-4xl font-bold">
                        $
                        {billingPeriod === "monthly"
                          ? pricingPlans[currentSlide].monthlyPrice
                          : pricingPlans[currentSlide].yearlyPrice}
                      </span>
                      <span className="mt-0 ml-2 text-sm text-gray-400">
                        per editor/month
                        <br />
                        billed {billingPeriod}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex-shrink-0 rounded-full bg-[#35F148] p-1">
                        <Check className="h-3 w-3 text-black" />
                      </div>
                      <span className="text-sm">{pricingPlans[currentSlide].fastGenerations} Fast generations</span>
                    </div>

                    {pricingPlans[currentSlide].features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 rounded-full bg-[#35F148] p-1">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                        <span className="text-sm font-poppins font-thin mt-1">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`mt-6 py-3 px-4 rounded-xl text-center text-base w-full ${
                      pricingPlans[currentSlide].isCurrent
                        ? "bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]"
                        : "bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] text-white transition-colors"
                    }`}
                  >
                    {pricingPlans[currentSlide].isCurrent ? "Current Plan" : "Choose Plan"}
                  </button>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {pricingPlans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index ? "bg-white w-4" : "bg-gray-500"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}