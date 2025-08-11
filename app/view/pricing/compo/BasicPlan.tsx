import React from 'react'

const BasicPlan = () => {
  return (
    <div className="rounded-2xl accent-border backdrop-blur-md glass-card bg-white/5 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-5 w-full shadow-lg relative">
      <div className="flex justify-between items-start">
        <h1 className="text-sm font-bold text-white">Basic</h1>
        <div className="text-right">
          <div className="text-sm font-bold text-white">₹0 <span className="text-xs font-normal text-white/70">+ GST</span></div>
          <div className="text-xs text-white/70">Per month</div>
        </div>
      </div>
      <div className="flex justify-center mt-4 mb-3">
        <button className="bg-[#006aff] text-white font-medium rounded-xl px-6 py-2 text-sm shadow-md">Activated</button>
      </div>
      <hr className="border-t border-white/10 my-3" />
      <ul className="space-y-2">
        <li className="flex items-center text-white text-sm font-medium"><span className="text-blue-400 mr-2 text-base">✔</span> <span className="font-bold">2,000 + 100 </span> credits included</li>
        <li className="flex items-center text-white text-sm font-medium"><span className="text-blue-400 mr-2 text-base">✔</span> Generate up to <span className="font-bold ml-1">105 images</span> <span className="ml-1 text-white/70">(model-dependent)</span></li>
        <li className="flex items-center text-white text-sm font-medium"><span className="text-blue-400 mr-2 text-base">✔</span> Generate up to <span className="font-bold ml-1">1080p</span> Full HD</li>
        <li className="flex items-center text-white text-sm font-medium"><span className="text-blue-400 mr-2 text-base">✔</span> 500MB Library Storage</li>
      </ul>
    </div>
  )
}

export default BasicPlan