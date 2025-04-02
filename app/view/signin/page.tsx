"use client";

import SignInForm from "./sign-in-form";
import Image from "next/image";

export default function SignIn() {
  return (
    <main className="flex min-h-screen bg-background overflow-hidden">
      <div className=" lg:w-[420px] min-w-[320px] lg:min-w-[420px] relative z-10 flex justify-center items-center">
      <SignInForm />
      </div>

      <div className=" lg:block flex-1 relative">
        <div className="absolute inset-0 border-black">
          <Image
            src="/signup/signup.png"
            alt="Artistic warriors"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  )
}

