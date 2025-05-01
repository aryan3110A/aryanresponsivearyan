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
    ["Le parapluie attrape des étoiles filantes", "La peinture cligne des yeux en regardant ", "Rainbow highway to nowhere", "માર્ગ કાચમાં સમાપ્ત થાય છે", "Bleedscape", "Baño de neón ","સુગંધ શાંત લાઇબ્રેરીમાં ફેલાય છે"," Electric owl guards vault", "Cyborg street poet sings"],
  ];

  return (
    <div className="text-white flex w-full overflow-hidden relative mt-10 ">
      {/* Left Side - Text Animation */}
      <div className="flex flex-col gap-9 mt-14 w-1/3 overflow-hidden lg:mt-44">
        {textRows.map((row, index) => (
          <motion.div
            key={index}
            className="flex whitespace-nowrap"
            initial={{ x: "-1500%" }}
            animate={{ x: "0%" }}
            transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
          >
            {row.map((name, i) => (
              <span key={i} className="text-4xl mx-4">
                {name}
              </span>
            ))}
            {/* Duplicate for smooth looping */}
            {row.map((name, i) => (
              <span key={`dup-${i}`} className="text-4xl mx-4">
                {name}
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Center Image */}
      <div className="relative w-1/3 flex justify-center">
        <img src="/Core/logomain.png" alt="new" className="relative z-10 w-auto" />
      </div>


      {/* Right Side - Image Animation */}
<div className="w-[40vw] overflow-hidden flex items-center justify-center">
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
        src={getImageUrl('landingpage','horizonalimage')}
        alt="Scrolling Banner"
        className="h-[400px] w-auto" // ← match logo height
      />
      <img
        src={getImageUrl('landingpage','horizonalimage')}
        alt="Scrolling Banner Duplicate"
        className="h-[400px] w-auto" // ← match logo height
      />
    </motion.div>
  </div>
</div>

    </div>
  );
};

export default SlideImage;
