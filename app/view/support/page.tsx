
"use client"

import { useState } from "react"
import Image from "next/image";
import { Search, Plus, Minus } from "lucide-react"
import Footer from "../Core/Footer";
import NavigationFull from "../Core/NavigationFull";

// FAQ data
const faqs = [
  {
    id: "01",
    question: "txt",
    answer:
      "Lorem ipsum dolor sit amet consectetur. In augue ipsum tellus ultrices. Ac pharetra ultrices consectetur consequat tellus massa. Nec aliquam cras sagittis duis sed euismod arcu hac. Ornare amet ligula ornare lacus aliquam aenean. Eu lacus imperdiet urna amet congue adipiscing. Faucibus magna nisl ullamcorper in facilisis consequat aliquam. Id placerat dui habitasse quisque nisl tincidunt facilisi mi id. Dictum elit velit.",
  },
  {
    id: "02",
    question: "txt",
    answer:
      "Lorem ipsum dolor sit amet consectetur. In augue ipsum tellus ultrices. Ac pharetra ultrices consectetur consequat tellus massa. Nec aliquam cras sagittis duis sed euismod arcu hac. Ornare amet ligula ornare lacus aliquam aenean.",
  },
  {
    id: "03",
    question: "txt",
    answer:
      "Lorem ipsum dolor sit amet consectetur. In augue ipsum tellus ultrices. Ac pharetra ultrices consectetur consequat tellus massa.",
  },
  {
    id: "04",
    question: "txt",
    answer: "Lorem ipsum dolor sit amet consectetur. In augue ipsum tellus ultrices.",
  },
  {
    id: "05",
    question: "txt",
    answer: "Lorem ipsum dolor sit amet consectetur.",
  },
]

export default function SupportPage() {

    const [openQuestion, setOpenQuestion] = useState("01") // First question open by default

  return (

<>
    <div className="min-h-screen bg-black text-white px-4 md:px-6 lg:px-8 pt-20">
      <NavigationFull />
      {/* Grid Container */}
      <div className="max-w-[90vw] mx-auto">
        {/* Top Row */}
        <div className="flex flex-wrap justify-center md:justify-between lg:justify-evenly gap-3 md:gap-0 lg:gap-0 mb-3 md:mb-4 lg:mb-5">
          <div className="relative w-[48%] md:w-[34%] lg:w-[33%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support1.png" // ✅ Another local image
              alt="3D Characters"
              fill
              className="object-fit"
            />
          </div>
          <div className="relative w-[48%] md:w-[18%] lg:w-[18%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support2.png" // ✅ Another local image
              alt="Kids Playing Soccer"
              fill
              className="object-fit"
            />
          </div>
       
          <div className="relative w-[48%] md:w-[29%] lg:w-[28%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support3.png" // ✅ Another local image
              alt="Neon Coffee Sign"
              fill
              className="object-fit"
            />
          </div>
          <div className="relative w-[48%] md:w-[15%] lg:w-[15%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support4.png" // ✅ Another local image
              alt="Neon Coffee Sign"
              fill
              className="object-fit"
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap justify-center md:justify-between lg:justify-evenly gap-3 md:gap-4 lg:gap-0 mb-3 md:mb-4 lg:mb-5">
          <div className="relative w-[48%] md:w-[18%] lg:w-[18%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support5.png" // ✅ Another local image
              alt="3D Characters"
              fill
              className="object-fit"
            />
          </div>
          <div className="relative w-[48%] md:w-[34%] lg:w-[33%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support8.png" // ✅ Another local image
              alt="Kids Playing Soccer"
              fill
              className="object-fit"
            />
          </div>
       
          <div className="relative w-[48%] md:w-[18%] lg:w-[18%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support6.png" // ✅ Another local image
              alt="Neon Coffee Sign"
              fill
              className="object-fit"
            />
          </div>
          <div className="relative w-[48%] md:w-[26%] lg:w-[25%] aspect-[6/3] rounded-2xl overflow-hidden">
            <Image
              src="/supportus/support7.png" // ✅ Another local image
              alt="Neon Coffee Sign"
              fill
              className="object-fit"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8 md:mb-14 md:mt-10 lg:mb-16 lg:mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4 md:mb-5 lg:mb-2 transition-colors 
            bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]  text-transparent bg-clip-text">
            We&apos;re Ready to Help!
          </h1> 
          <p className="text-white text-lg md:text-lg lg:text-lg max-w-full mx-auto ">
            Got a question or need help? Browse our FAQs or contact our support team for fast assistance.
          </p>
        </div>

        {/* Search Bar */}
        <div className=" max-w-4xl mx-auto relative  ">
          <div className="relative ">
            <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-[#FFFFFF] h-6 w-5" />
            <input
              type="text"
              placeholder="Search for articles..."
              className="w-full pl-16 pr-4 py-3 md:py-4 rounded-full bg-[#343434] text-white placeholder-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>



        <div className="max-w-[60rem] mx-auto mt-16 md:mt-36 lg:mt-36 px-4 md:px-8 lg:px-8">
  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-12 md:mb-12 lg:mb-14">
    Frequently Asked <br /> Questions
  </h2>

  <div className="md:space-y-8 lg:space-y-8">
    {faqs.map((faq) => (
      <div
        key={faq.id}
        className="border border-[#152329]  rounded-sm md:rounded-lg md:border-[3px] lg:rounded-xl  overflow-hidden"
      >
        <button
          onClick={() => setOpenQuestion(openQuestion === faq.id ? "" : faq.id)}
          className="w-full flex items-center justify-between  p-0 md:p-0 lg:pt-0 lg:pl-0 text-left hover:bg-gray-900/50 transition-colors"
          aria-expanded={openQuestion === faq.id}
          aria-controls={`faq-${faq.id}`}
        >
          <div className="flex items-center md:space-x-8 lg:space-x-10">
            <span className="text-lg  md:text-xl md:ml-11 lg:text-2xl font-medium">{faq.id}</span>
            <span className="text-lg md:text-xl lg:text-2xl ml-0 font-semibold ">{faq.question}</span>
          </div>
          <div
  className={`w-12 h-12 md:w-20 md:h-20 lg:w-20 lg:h-20 flex items-center justify-center rounded-r-lg flex-shrink-0 transition-colors 
  ${openQuestion === faq.id ? "bg-gradient-to-b from-[#5AD7FF] to-[#656BF5]" : "bg-[#152329]"}`}
>
  {openQuestion === faq.id ? (
    <Minus className="w-6 md:w-8 lg:w-10 h-6 md:h-8 lg:h-10 text-white" />
  ) : (
    <Plus className="w-6 md:w-8 lg:w-10 h-6 md:h-8 lg:h-10 text-white" />
  )}
</div>

        </button>

        <div
          id={`faq-${faq.id}`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openQuestion === faq.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 md:ml-[5.2rem] md:pt-4 lg:p-10 pt-0 text-white leading-relaxed md:text-[1.2rem]  lg:text-[1.2rem] lg:ml-[4.5rem]">
            {faq.answer}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>

    </div>
    <Footer />

    </>
  )
}