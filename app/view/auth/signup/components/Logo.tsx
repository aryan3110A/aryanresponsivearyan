import * as React from 'react';

export default function Logo({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      {...props}
      role="img"
      aria-label="WildMind logo"
    >
      {/* Simple WM mark */}
      <path
        d="M3 6l4 20 5-12 5 12 4-20"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
