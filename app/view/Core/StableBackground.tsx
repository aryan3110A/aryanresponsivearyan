import React from "react";


// Stable background component that doesn't re-render with input changes
const StableBackground: React.FC = React.memo(() => (
  <div className="absolute inset-0 w-full h-full z-0">
    {/* <Particles
      particleColors={['#ffffff', '#ffffff']}
      particleCount={200}
      particleSpread={10}
      speed={0.02}
      particleBaseSize={100}
      moveParticlesOnHover={false}
      alphaParticles={false}
      disableRotation={false}
    /> */}
  </div>
));

StableBackground.displayName = 'StableBackground';

export default StableBackground; 