import React from "react";
import Image from 'next/image';
import { getImageUrl } from '../routes/imageroute';

import "./globals.css";
import Main from "./view/landingPage/page";

// Define Page as a React functional component
const Page: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Using core images */}
      <div className="relative w-32 h-32">
        <Image
          src={getImageUrl('core', 'logo')}
          alt="Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Using auth images */}
      <div className="relative w-full h-48">
        <Image
          src={getImageUrl('auth', 'loginBg')}
          alt="Login Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Using dashboard images */}
      <div className="relative w-16 h-16">
        <Image
          src={getImageUrl('dashboard', 'statsIcon')}
          alt="Stats Icon"
          fill
          className="object-contain"
        />
      </div>
    </main>
  );
};

export default Page;
