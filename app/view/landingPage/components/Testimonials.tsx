// import { User } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Sarvam AI has completely transformed my creative process! The speed and precision of its text-to-image generation are unmatched. I can bring my ideas to life faster than ever, and the results are simply stunning. A game-changer for designers like me!",
    user: "Emily Johnson",
    role: "Digital Artist",
    image: "/emily.png",
  },
  {
    quote:
      "I've used many AI tools, but nothing comes close to the versatility and power of Sarvam AI. From generating unique game assets to conceptualizing entire environments, this platform saves me hours of work while delivering incredible quality. Highly recommend it!",
    user: "Mark Thompson",
    role: "Game Developer",
    image: "/mark.png",
  },
  {
    quote:
      "Sarvam AI brings imagination to reality with effortless creativity. Its powerful features helped me create dynamic visuals for multiple branding projects, impressing my clients every time. The user-friendly interface and performance are top-notch!",
    user: "Sophia Patel",
    role: "Branding Consultant",
    image: "/sophia.png",
  },
];

export function Testimonials() {
  return (
    <section className="bg-black px-20 py-20 pt-40 pb-52 mb:px-4 mb:py-10">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white mb:text-[24px]">
            See What the World Is Saying About Sarvam AI.
          </h1>
          <p className="mx-auto max-w-4xl text-lg text-white mb:text-[12px] mb:px-4">
            The success of our AI goes beyond the tech itself—it&apos;s powered by a vast, interconnected 
            network of developers, researchers, and users who share a commitment to advancing the field.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid px-24 mb:px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-800 mb:flex mb:flex-col mb:divide-none">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="group text-l p-6 text-white hover:cursor-pointer text-center md:text-left">
                <p className="mb-4 italic text-[18px] mb:text-[12px]">&quot{testimonial.quote}&quot</p>
                
                {/* User Info */}
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.user} profile`}
                      width={40}
                      height={40}
                      className="rounded-full transition-all duration-200 ease-linear group-hover:scale-125"
                    />
                  </div>
                  <span className="text-sm">
                    <span className="text-gray-200 block transition-colors duration-300 group-hover:text-blue-400">
                      {testimonial.user}
                    </span>
                    <span className="text-gray-400 transition-colors duration-300 group-hover:text-blue-400">
                      {testimonial.role}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
