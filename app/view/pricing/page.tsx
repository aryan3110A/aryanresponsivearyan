"use client"

import React, { useState } from 'react';
import PlanCard from './compo/PlanCard';
import BasicPlan from './compo/BasicPlan';
import EnterprisePlan from './compo/EnterprisePlan';
import ComparisonTable from './compo/ComparisonTable';
import CreditsSelector from './compo/CreditsSelector';

import NavigationFull from '../Core/NavigationFull';

// FreeTrialCard component
const FreeTrialCard = () => (
  <div className="rounded-2xl accent-border backdrop-blur-md glass-card bg-white/5 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-8 w-full h-full mx-auto shadow-lg flex flex-col items-center justify-center min-h-[260px]">
    <div className="mb-2">
      <span className="bg-[#35354a] text-xs text-white/80 px-3 py-1 rounded-full font-medium">WildMind AI</span>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2 text-center">Start Your 30-Day Free Trial</h2>
    <p className="text-base text-white/80 mb-6 text-center">Write 10x faster, engage your audience, & never struggle with the blank page again.</p>
    <button className="bg-[#1870f3] text-white font-semibold rounded-lg px-8 py-3 text-base shadow-md hover:bg-[#0059c9] transition">Start 30-Day Free Trial &rarr;</button>
  </div>
);

const plans = [
  {
    title: 'Hobbyist',
    monthlyPrice: 675,
    annualPrice: 540,
    features: [
      <>{' '}<span className="font-bold">10,000 credits + 200 Free</span>{' '}credits included</>,
      <>10 GB Library Storage</>,
      <>Generate up to:{' '}<span className="font-bold">510 images</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to:{' '}<span className="font-bold">25 videos</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to{' '}<span className="font-bold">1080p Full HD</span>{' '}resolution</>,
    ],
    activated: true,
    knowMoreLink: '#comparison',
  },
  {
    title: 'Creator',
    monthlyPrice: 1350,
    annualPrice: 1080,
    features: [
      <>{' '}<span className="font-bold">20,000 credits + 500 Free</span>{' '}credits included</>,
      <>20 GB Library Storage</>,
      <>Generate up to:{' '}<span className="font-bold">1,025 images</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to:{' '}<span className="font-bold">50 videos</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to{' '}<span className="font-bold">2K</span>{' '}resolution</>,
    ],
    highlight: 'Best Offer',
    activated: true,
    knowMoreLink: '#comparison',
  },
  {
    title: 'Professional',
    monthlyPrice: 2810,
    annualPrice: 2248,
    features: [
      <>{' '}<span className="font-bold">40,000 credits + 1,000 Free</span>{' '}credits included</>,
      <>50 GB Library Storage</>,
      <>Generate up to:{' '}<span className="font-bold">2,055 images</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to:{' '}<span className="font-bold">100 videos</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to{' '}<span className="font-bold">4K</span>{' '}resolution</>,
    ],
    activated: true,
    knowMoreLink: '#comparison',
  },
  {
    title: 'Collective',
    monthlyPrice: 11250,
    annualPrice: 9000,
    features: [
      <>{' '}<span className="font-bold">1,60,000 credits + 4,000 Free</span>{' '}credits included</>,
      <>200 GB Library Storage</>,
      <>Generate{' '}<span className="font-bold">Unlimied Images</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to:{' '}<span className="font-bold">400 videos</span>{' '}<span className="text-white/70">(model-dependent)</span></>,
      <>Generate up to{' '}<span className="font-bold">4K</span>{' '}resolution</>,
    ],
    activated: true,
    knowMoreLink: '#comparison',
  },
];

const PricingPage = () => {
  const [billing, setBilling] = useState<'monthly' | 'annually'>('monthly');

  const formatINR = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(n))}`;

  const getDisplayPrice = (monthlyPrice: number, annualPrice?: number) => {
    const price = billing === 'monthly' ? monthlyPrice : (annualPrice ?? monthlyPrice);
    return formatINR(price);
  };

  const perLabel = 'Per month';
  return (
    <div className='bg-black text-white flex flex-col items-center min-h-screen'>
      <NavigationFull />
      {/* Spacer to offset fixed navigation height (reduced) */}
      <div className="h-12 md:h-16" />
      <div className='flex p-3 rounded-lg w-[90vw] bg-white/5 backdrop-blur-md shadow-lg items-center border border-white/20'><h1 className=''>Use Referal Code for 50% bonus Credit 60%</h1></div>
      <div className="flex items-center justify-center mt-8">
        <div className="flex rounded-full p-2  border border-white/10 backdrop-blur-md bg-white/5 backdrop-blur-md shadow-lg  w-[320px] max-w-full">
          <button
            className={`flex-1 py-2 rounded-full font-bold text-sm transition-all duration-200 ${billing === 'monthly' ? 'bg-[#006aff] text-white shadow-md' : 'bg-transparent text-white/80'}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`flex-1 py-2 rounded-full font-bold text-sm transition-all duration-200 ${billing === 'annually' ? 'bg-[#006aff] text-white shadow-md' : 'bg-transparent text-white/80'}`}
            onClick={() => setBilling('annually')}
          >
            Annually <span className="font-bold">25%</span>
          </button>
        </div>
      </div>
      {/* Top section: 70/30 ratio */}
      <div className="w-full max-w-7xl mt-12 flex flex-col md:flex-row gap-8 items-stretch ">
        <div className="md:w-[70%] flex ">
          <BasicPlan />
        </div>
        <div className="md:w-[30%] flex">
          <div className="w-full h-full"><FreeTrialCard /></div>
        </div>
      </div>
      {/* Plan cards row (reduced top margin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mt-12 w-full max-w-7xl items-stretch ">
        {plans.map((plan) => (
          <div key={plan.title} className="flex">
            <PlanCard
              title={plan.title}
              price={getDisplayPrice(plan.monthlyPrice, (plan as any).annualPrice)}
              per={perLabel}
              features={plan.features}
              highlight={plan.highlight}
              activated={plan.activated}
              knowMoreLink={plan.knowMoreLink}
            />
          </div>
        ))}
      </div>
      <div className="w-auto max-w-7xl mt-12 flex justify-start ml-0">
        <EnterprisePlan />
      </div>
      <div id="comparison">
        <ComparisonTable />
      </div>
      <CreditsSelector />
    </div>
  )
}

export default PricingPage;