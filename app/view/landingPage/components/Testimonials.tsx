"use client";

import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Frontend Developer",
    text: "This platform transformed the way I learn new tech. The courses are concise and engaging!",
  },
  {
    name: "Mark Thompson",
    role: "Full Stack Engineer",
    text: "I was able to land a job within 3 months. Couldn&apos;t have done it without this amazing platform.",
  },
  {
    name: "Sophie Lee",
    role: "UI/UX Designer",
    text: "The community support and project-based learning are game-changers for any self-learner.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black text-white py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Don&apos;t take our word for it
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 mr-1" />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">
                &quot;{testimonial.text}&quot;
              </p>
              <p className="font-semibold text-lg text-white">
                {testimonial.name}
              </p>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
