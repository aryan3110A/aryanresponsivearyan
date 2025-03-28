"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import NavigationFull from "../Core/NavigationFull";

type BillingPeriod = "monthly" | "yearly";

interface PlanFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  isCurrent?: boolean;
  fastGenerations: string;
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
];

export default function SubscriptionToggle() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [animateToggle, setAnimateToggle] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);

  const handleToggle = (period: BillingPeriod) => {
    if (period !== billingPeriod) {
      setAnimateToggle(true);
      setBillingPeriod(period);
    }
  };

  useEffect(() => {
    if (animateToggle) {
      const timer = setTimeout(() => {
        setAnimateToggle(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animateToggle]);

  return (
    <div className="min-h-screen relative text-white p-10 flex flex-col items-center justify-center overflow-hidden">
      <NavigationFull />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black"></div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMAGE.png-p25HHotUZ8sVxj9ksdnA0cp4oxlEhH.jpeg"
          alt="Background gradient"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="relative z-10 w-full max-w-[90%]">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-10">
            Purchase a subscription
          </h1>
          <p className="text-xl text-[#FFFFFF]">
            Choose the plan that works for you.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-16">
          <div className="relative bg-[#FFFFFF] rounded-full p-1 flex w-[25%] h-[3.8rem]">
            {/* Animated Background */}
            <div
              className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-b from-[#5AD7FF] to-[#656BF5] transition-all duration-300 ease-in-out ${
                billingPeriod === "monthly"
                  ? "left-1 right-[calc(50%+1px)]"
                  : "left-[calc(50%+1px)] right-1"
              }`}
            ></div>

            {/* Monthly Button */}
            <button
              onClick={() => handleToggle("monthly")}
              className={`flex-1 relative z-10 py-2 rounded-full text-center text-lg transition-colors ${
                billingPeriod === "monthly" ? "text-white" : "text-[#1D2127]"
              }`}
            >
              Monthly
            </button>

            {/* Yearly Button */}
            <button
              onClick={() => handleToggle("yearly")}
              className={`flex-1 relative z-10 py-2 rounded-full text-center text-lg transition-colors ${
                billingPeriod === "yearly" ? "text-white" : "text-[#1D2127]"
              }`}
            >
              Yearly <span className="text-sm text-emerald-300">-20% off</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Container */}
        <div className="m-4 p-4 rounded-3xl w-full bg-[linear-gradient(to_bottom,black_20%,gray_60%,white_100%)]">
          {/* Pricing Cards */}
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
                      $
                      {billingPeriod === "monthly"
                        ? plan.monthlyPrice
                        : plan.yearlyPrice}
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
                    <span className="text-sm">
                      {plan.fastGenerations} Fast generations
                    </span>
                  </div>

                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2 ">
                      <div className="mt-1 flex-shrink-0 rounded-full bg-[#35F148] p-1">
                        <Check className="h-3 w-3 text-black" />
                      </div>
                      <span className="text-sm  font-poppins font-thin mt-1 ">
                        {feature.text}
                      </span>
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
      </div>
    </div>
  );
}
