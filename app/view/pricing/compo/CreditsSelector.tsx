import React, { useState } from 'react';

const marks = [1000, 2000, 5000, 10000];

// Manually set prices for each corresponding entry in `marks`
// Indexes must align: priceByIndex[i] is the price for marks[i]
const priceByIndex: number[] = [200, 300, 625, 1000];

function formatNumber(n: number) {
  return n.toLocaleString('en-IN');
}

function formatINR(n: number) {
  const formatter = new Intl.NumberFormat('en-IN');
  return `₹${formatter.format(n)}`;
}

const CreditsSelector: React.FC = () => {
  const [index, setIndex] = useState(0); // default 1,000

  const credits = marks[index];
  const price = priceByIndex[index] ?? 0;
  const maxIndex = marks.length - 1;
  const percent = (index / maxIndex) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 mb-10">
      <h3 className="text-white text-2xl font-extrabo-ld text-center mb-6">Extra Credits</h3>
      {/* Side-by-side layout with slider taking more space */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Left info card (narrower) */}

        <div className="rounded-2xl accent-border backdrop-blur-md glass-card bg-white/5 backdrop-blur-md shadow-lg rounded-xl border border-white/10 p-8 flex flex-col justify-center md:basis-1/4 md:max-w-sm">
          <div className="text-3xl font-extrabold bg-gradient-to-r from-white to-[#9cc7ff] bg-clip-text text-transparent">{formatNumber(credits)} credits</div>
          <div className="text-white/80 text-base mt-3 flex items-end gap-2">
            <span className="text-2xl font-semibold text-white">{formatINR(price)}</span>
            <span className="text-white/60 text-xs mb-0.5">+ GST</span>
          </div>
          <div className="text-white/60 text-xs mt-2">Adjust anytime. Unused credits roll over to next month.</div>
        </div>

        {/* Slider (wider) */}
        <div className="md:basis-3/4 flex-1 rounded-2xl accent-border backdrop-blur-md glass-card bg-transparent p-8">
          <div className="w-full relative pt-10 pb-8">
            <input
              aria-label="Credits selector"
              type="range"
              min={0}
              max={marks.length - 1}
              step={1}
              value={index}
              onChange={(e) => setIndex(parseInt(e.target.value, 10))}
              className="relative z-10 w-full h-3 appearance-none rounded-full outline-none"
              style={{
                backgroundImage: `linear-gradient(to right, #1870f3 0%, #1870f3 ${percent}%, #2f3442 ${percent}%, #2f3442 100%)`,
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            />

            <style jsx>{`
              input[type="range"] {
                background-color: transparent;
                transition: background-image 120ms ease;
              }
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 24px;
                width: 24px;
                border-radius: 9999px;
                background: radial-gradient(closest-side, #ffffff 0%, #e9f0ff 35%, #c7dcff 60%, #006aff 62%);
                border: 2px solid #0057d6;
                box-shadow: 0 6px 14px rgba(0, 106, 255, 0.35), 0 0 0 6px rgba(24, 112, 243, 0.18);
                cursor: pointer;
                margin-top: -11px;
                transition: transform 120ms ease, box-shadow 120ms ease;
              }
              input[type="range"]:hover::-webkit-slider-thumb {
                transform: scale(1.06);
                box-shadow: 0 8px 18px rgba(0, 106, 255, 0.45), 0 0 0 7px rgba(24, 112, 243, 0.22);
              }
              input[type="range"]:active::-webkit-slider-thumb {
                transform: scale(0.98);
              }
              input[type="range"]::-moz-range-thumb {
                height: 24px;
                width: 24px;
                border-radius: 9999px;
                background: radial-gradient(closest-side, #ffffff 0%, #e9f0ff 35%, #c7dcff 60%, #006aff 62%);
                border: 2px solid #0057d6;
                box-shadow: 0 6px 14px rgba(0, 106, 255, 0.35), 0 0 0 6px rgba(24, 112, 243, 0.18);
                cursor: pointer;
                transition: transform 120ms ease, box-shadow 120ms ease;
              }
              input[type="range"]::-moz-range-track {
                background: transparent;
              }
            `}</style>

            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20">
              {marks.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setIndex(i)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${(i / maxIndex) * 100}%` }}
                >
                  <span className={`${i <= index ? 'bg-[#1870f3]' : 'bg-white/25'} block h-3 w-0.5 rounded`}></span>
                  <span className="mt-2 block text-[11px] text-white/70 group-hover:text-white">
                    {m >= 1000 ? `${m / 1000}k` : `${m}`}
                  </span>
                </button>
              ))}
            </div>

            <div
              className="pointer-events-none absolute -top-8 z-30"
              style={{ left: `calc(${percent}% )`, transform: 'translateX(-50%)' }}
            >
              <div className="rounded-lg bg-[#0b1020]/90 border border-white/10 px-3 py-1 text-xs text-white shadow-xl">
                {formatNumber(credits)} • {formatINR(price)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-[#006aff] hover:bg-[#0057d6] text-white font-semibold rounded-2xl px-10 py-3 text-base shadow-md transition">
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default CreditsSelector;