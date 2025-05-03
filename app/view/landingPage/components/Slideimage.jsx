"use client";
import React from "react";
import { motion } from "framer-motion";
import { getImageUrl } from "@/routes/imageroute";

const SlideImage = () => {
  // Define your text rows: each sub-array is a row, each string is a word
  const textRows = [
    ["Shrek renaissance", "स्वप्न लूप होटल", "ચુંબકીય દિશાદર્શક ચાંદની હેઠળ ફરે ", "Glitchface", "Le piano joue doucement tout seul", "Jollitown","Beepzone","Gloombot","बबलगम बादल कुकीज़ की बारिश करते हैं","Zoom call with ghosts","Blender dreaming of freedom", "Potion shop in cloud","जेली से बना फ़ायरवॉल", "Black cat reads tarot ", " Chrome roses on rooftop", "Hacker dreams in neon"],
    ["Upside-down circus in swamp", "Sandcastle hiding lost city", "Books rearrange at night", "Grandma’s house feels alive", "Rocking chair keeps rocking", "Unicorn floats above hospital","રસ્તાની લાઈટ ધૂંધળી થાય છે અને પછી અદૃશ્ય થઈ જાય છે", "Printer jammed with thought", "ધુમ્મસ ખાલી શહેરને ગ્રસે છે ", "Parque infantil con niebla","Abogado plátano", "Esqueleto haciendo twerking"," La luz parpadea en bucle","Centro comercial olvidado al anochecer","Fantasma de arcade bebiendo refresco","Fantasmas amigables con sudaderas"],
    ["Árboles de malvavisco cerca del lago ", "Orquesta de gatos bajo la luz de la luna", " भूतिया दफ़्तर | उदास वेंडिंग मशीन", "Voidlight", "चीख़ता हुआ आईना", "खाली आर्केड","TikTok demon doing taxes","Black cat reads tarot","साइबर कौआ बाइट्स खा रहा है","शहर पर डेटा तूफ़ान | खंडहर में एआई मंदिर","Le tiroir du bureau mène sous terre","Wyrmhole","La forêt bourdonne de lumière"],
    ["Le parapluie attrape des étoiles filantes", "La peinture cligne des yeux en regardant ", "Rainbow highway to nowhere", "માર્ગ કાચમાં સમાપ્ત થાય છે", "Bleedscape", "Baño de neón ","સુગંધ શાંત લાઇબ્રેરીમાં ફેલાય છે"," Electric owl guards vault", "Cyborg street poet sings , | खंडहर में एआई मंदिर","Le tiroir du bureau mène sous terre","Wyrmhole","La forêt bourdonne de lumière" ,  "खंडहर में एआई मंदिर Le tiroir du bureau mène sous terre","Wyrmhole","La forêt bourdonne de lumière"],
    
  ];

  return (
    <>
    <div className="text-white flex w-full overflow-hidden relative mt-14 mb:items-center mb:gap-2 mb:mt-8">

  {/* Left Side - Text Animation */}
  <div className="flex flex-col gap-12 mt-14 w-[38vw] overflow-hidden mb:gap-1 mb:w-full mb:mt-0">
    {textRows.map((row, index) => (
      <motion.div
        key={index}
        className="flex whitespace-nowrap mb:justify-center"
        initial={{ x: "-1500%" }}
        animate={{ x: "0%" }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
      >
        {row.map((name, i) => (
          <span
            key={i}
            className="text-4xl mx-4 mb:text-[10px] mb:mx-2"
          >
            {name}
          </span>
        ))}
        {row.map((name, i) => (
          <span
            key={`dup-${i}`}
            className="text-4xl mx-4 mb:text-[10px] mb:mx-2"
          >
            {name}
          </span>
        ))}
      </motion.div>
    ))}
  </div>

  <div className="w-1/4 flex items-center justify-center relative mb:w-full mb:justify-center mb:items-center">
  {/* White glow behind logo (all screens) */}
  <div className="absolute z-0 w-[111px] h-[111px] md:w-[530px] md:h-[530px] rounded-full opacity-40 blur-2xl" />

  {/* Logo */}
  <img
    src="/Core/logosquare.png"
    alt="new"
    className="relative z-10 h-[350px] w-[400px] mb:h-[111px] mb:w-[111px]"
  />
</div>






  {/* Right Side - Image Animation */}
  <div className="w-[40vw] overflow-hidden flex items-center justify-center mb:w-full mb:h-[150px]">
    <div className="w-full overflow-hidden relative">
      <motion.div
        className="flex min-w-max"
        animate={{ x: ["-90%", "0%"] }}
        transition={{
          repeat: Infinity,
          duration: 60,
          ease: "linear",
        }}
      >
        <img
          src={getImageUrl("landingpage", "horizonalimage")}
          alt="Scrolling Banner"
          className="h-[400px] w-auto mb:h-[160px] mb:w-auto"
        />
        <img
          src={getImageUrl("landingpage", "horizonalimage")}
          alt="Scrolling Banner Duplicate"
          className="h-[400px] w-auto mb:h-[160px] mb:w-auto"
        />
      </motion.div>
    </div>
  </div>

  
</div>
<div  style={{
      boxShadow: '0 10px 80px 20px rgba(255, 255, 255, 0.35)',
    }}>
  
  </div>
  </>
  );
};

export default SlideImage;