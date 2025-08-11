import React from 'react';

interface PlanCardProps {
  title: string;
  price: string;
  priceUnit?: string;
  per?: string;
  features: React.ReactNode[];
  highlight?: string;
  activated?: boolean;
  knowMoreLink?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  priceUnit = '+ GST',
  per = 'Per month',
  features,
  highlight,
  activated,
  knowMoreLink,
}) => {
  return (
    <div className={`w-full h-full shadow-lg relative flex flex-col overflow-visible accent-border backdrop-blur-md glass-card bg-white/5 backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${highlight ? 'rounded-t-none rounded-b-2xl' : 'rounded-2xl'}` }>
      {highlight && (
        <div className="absolute left-0 right-0 top-0 -translate-y-full z-20">
          <div className="bg-[#006aff] text-white text-xs font-bold text-center rounded-t-2xl py-2">
            {highlight}
          </div>
        </div>
      )}
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <h1 className="text-base font-bold text-white">{title}</h1>
          <div className="text-right leading-tight">
            <div className="text-xl font-semibold text-white">{price}</div>
            <div className="text-[10px] text-white/70 mt-0.5">{priceUnit}</div>
            <div className="text-xs text-white/70">{per}</div>
          </div>
        </div>
        <div className="flex justify-center mt-6 mb-4">
          <button className={`${activated ? 'bg-[#006aff] text-white' : 'bg-transparent text-[#006aff] border border-[#006aff]'} w-full font-medium rounded-xl px-8 py-2 text-base shadow-md`}>{activated ? 'Activated' : 'Activate'}</button>
        </div>
        <div className="text-sm font-semibold text-white mb-2 mt-2">Best in</div>
        <hr className="border-t border-white/10 my-2" />
        <ul className="space-y-3 mb-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-white text-sm font-medium whitespace-normal break-words leading-relaxed">
              <span className="text-[#006aff] mr-2 text-base mt-0.5 shrink-0">✔</span>
              <span className="flex-1">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          {knowMoreLink && (
            <a
              href={knowMoreLink || '#comparison'}
              className="block w-full text-center text-[#006aff] text-sm font-medium underline mt-2"
            >
              Know More
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;