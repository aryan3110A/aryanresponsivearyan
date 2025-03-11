import { Heart } from "lucide-react";
import HeroSection from "./components/hero-section";
import FeaturesSection from "./components/features-section";
import ImageCreationSection from "./components/image-creation-section";


export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#9757FF]/45 from-0% via-[#9757FF]/5 via-40% to-black to-50%">
      <div className="max-w-7xl mx-auto p-4">
        <HeroSection />
        <FeaturesSection />
        <ImageCreationSection />
      </div>
    </main>
  )
}

