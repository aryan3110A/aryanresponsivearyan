'use client'


import React, { useState } from 'react';

interface NewsletterSignupProps {
  onSubmit?: (email: string) => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && isChecked) {
      onSubmit?.(email);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="relative bg-[rgba(255,255,255,0.1)] backdrop-blur-lg backdrop-saturate-150 border border-white border-opacity-20 rounded-xl p-8 max-w-4xl mx-auto text-white shadow-2xl overflow-hidden">
      {/* Clean static inner glow for glass depth */}
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/5 to-transparent rounded-xl pointer-events-none"></div>
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        {/* Left side text */}
        <div className="flex flex-col space-y-2 md:space-y-4">
          <span className="uppercase text-gray-300 text-sm font-medium tracking-wider drop-shadow-sm">
            Newsletter Signup
          </span>
          <h2 className="font-bold text-3xl md:text-4xl leading-tight drop-shadow-md">
            Subscribe for<br />the updates!
          </h2>
        </div>

        {/* Right side form */}
        <div className="flex flex-col space-y-4 w-full md:w-auto min-w-80">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {/* Email input with clean glass effect */}
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              required
              className="bg-[rgba(255,255,255,0.08)] backdrop-blur-sm border border-white border-opacity-20 rounded-md px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:border-white focus:border-opacity-40 focus:bg-[rgba(255,255,255,0.12)] transition-all duration-300 shadow-inner"
            />
            
            {/* Checkbox and Privacy Policy */}
            <label className="flex items-start space-x-3 text-gray-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                required
                className="accent-white w-4 h-4 mt-0.5 flex-shrink-0 opacity-80"
              />
              <span className="select-none drop-shadow-sm">
                I agree to the{' '}
                <a 
                  href="#" 
                  className="underline hover:text-white transition-colors duration-200 drop-shadow-sm"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            
            {/* Clean liquid glass button */}
            <button
              type="submit"
              disabled={!email || !isChecked}
              className="relative bg-[rgba(255,255,255,0.15)] backdrop-blur-md border border-white border-opacity-30 hover:bg-[rgba(255,255,255,0.25)] hover:border-opacity-40 disabled:bg-[rgba(255,255,255,0.05)] disabled:border-opacity-10 disabled:cursor-not-allowed rounded-md px-6 py-3 text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 shadow-lg overflow-hidden"
            >
              {/* Static button inner glow */}
              <div className="absolute inset-[1px] bg-gradient-to-t from-transparent to-white to-transparent opacity-[0.08] rounded-md"></div>
              
              {/* Button content */}
              <span className="relative z-10 drop-shadow-sm">View More</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;