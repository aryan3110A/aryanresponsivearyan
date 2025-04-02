"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {APP_ROUTES} from "../../../../routes/routes";

const Button = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-10">
      <button
        className="group bg-blue-600 text-white flex w-56 h-10 justify-center items-center gap-3 rounded-full relative overflow-hidden"
        onClick={() => router.push(APP_ROUTES.SIGNUP)} // ✅ onClick on button
      >
        {/* Image - Moves to center on hover */}
        <Image
          src="/Landingpage/Header/Group.png" // ✅ Fixed image path
          alt="Group Icon"
          width={24}
          height={24}
          className="absolute left-6 transition-all duration-500 ease-in-out group-hover:left-1/2 group-hover:-translate-x-1/2"
        />

        {/* Text - Disappears on hover */}
        <span className="text-[16px] transition-opacity duration-500 ease-in-out group-hover:opacity-0 ml-8">
          Start creating now!
        </span>
      </button>
    </div>
  );
};

export default Button;
