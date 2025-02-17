import { User } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Sarvam AI has completely transformed my creative process! The speed and precision of its textto-image generation are unmatched. I can bring my ideas to life faster than ever, and the results are simply stunning. A game-changer for designers like me!",
    user: "Emily Johnson,",
    role: "Digital Artist",
    image: "/Landingpage/Sayings/svg1.svg",
  },
  {
    quote:
      "I've used many AI tools, but nothing comes close to the versatility and power of Sarvam AI. From generating unique game assets to conceptualizing entire environments, this platform saves me hours of work while delivering incredible quality. Highly recommend it!",
    user: "Mark Thompson, ",
    role: "Game Developer",
    image: "/Landingpage/Sayings/svg2.svg",
  },
  {
    quote:
      "Sarvam AI brings imagination to reality with eortless creativity. Its powerful features helped me create dynamic visuals for multiple branding projects, impressing my clients every time. The userfriendly interface and performance are top-notch!",
    user: "Sophia Patel, ",
    role: "Branding Consultant",
    image: "/Landingpage/Sayings/sophia.png",
  },
];

export function Testimonials() {
  return (
    <section className="bg-black px-20 py-20 pt-40 pb-52">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            See What the World Is Saying About Sarvam AI.
          </h1>
          <p className="mx-auto max-w-4xl text-lg text-white">
            The success of our AI goes beyond the tech itself- it's powered by a
            vast, interconnected network of developers, researchers, and users
            who share a commitment to advancing the field.
          </p>
        </div>

        <div className="grid px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-800">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="group text-l p-6 text-white hover:cursor-pointer">
                <p className="mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.user} profile`}
                      width={40}
                      height={40}
                      className="rounded-full transition-all duration-100 ease-linear group-hover:scale-150 group-hover:mx-4 mt-4 mb-4  group-hover:translate-x-3"
                    />
                  </div>
                  <span className="text-sm">
                    <span className="text-gray-200 transition-colors duration-300 group-hover:text-blue-400">
                      {testimonial.user}
                    </span>
                    <br />
                    <span className="text-gray-200 transition-colors duration-300 group-hover:text-blue-400">
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