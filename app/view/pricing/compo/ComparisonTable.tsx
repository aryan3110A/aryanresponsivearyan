import React from 'react';

const ComparisonTable: React.FC = () => {
  const headers = new Array(5).fill('Compare all benefits');

  const features = [
    'Fast Tokens',
    'Token Rollover',
    'Top-up Tokens',
    'Concurrent Generations',
    'Generation Queue',
    'Relaxed Image Generation',
    'Relaxed Video Generation',
    'Relaxed Image Concurrency',
    'Relaxed Video Concurrency',
    'Relaxed Image Queue',
    'Relaxed Video Queue',
    'First-party models excluded from\nUnlimited Generation',
    'Third-party models excluded from\nUnlimited Generation',
  ];

  // For now, all plans include all features
  const hasFeature = () => true;

  return (
    <div className="w-full max-w-7xl  mt-12">
      <div className="rounded-2xl accent-border backdrop-blur-md glass-card bg-white/5 backdrop-blur-md shadow-lg rounded-xl border border-white/10 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed max-w-7xl">
            <thead>
              <tr className="bg-gradient-to-b from-[#2b2b33]/60 to-[#222228]/60 text-white/90">
                <th className="text-left text-sm font-semibold p-4">Compare all benefits</th>
                {headers.map((h, i) => (
                  <th key={i} className="text-left text-sm font-semibold p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white/5' : 'bg-white/0'}>
                  <td className="align-top p-4 text-sm text-white whitespace-pre-line">{feature}</td>
                  {headers.map((_, colIdx) => (
                    <td key={colIdx} className="p-4 text-sm">
                      {hasFeature() ? (
                        <span className="text-[#006aff]">✔</span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;