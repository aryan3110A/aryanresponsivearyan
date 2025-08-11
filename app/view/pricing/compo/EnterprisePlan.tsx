import React from 'react';

interface EnterprisePlanProps {
  onContact?: () => void;
}

const EnterprisePlan: React.FC<EnterprisePlanProps> = ({ onContact }) => {
  return (
    <div className="rounded-2xl accent-border backdrop-blur-md glass-card bg-white/5 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-8 w-auto shadow-lg">
      <div className="flex flex-col items-start justify-start gap-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Enterprise Plan</h3>
          <button
            onClick={onContact}
            className="bg-[#006aff] hover:bg-[#0057d6] text-white font-semibold rounded-2xl px-10 py-3 text-base shadow-md transition"
          >
            Contact
          </button>
      </div>
    </div>
  );
};

export default EnterprisePlan;