import SignInForm from "./sign-in-form";
import Image from "next/image";

export default function SignIn() {
  return (
    <main className="flex min-h-screen bg-background overflow-hidden">
      <div className="w-[100vw] h-[100vh] lg:w-[420px] min-w-[320px] lg:min-w-[420px] relative z-10">
        <SignInForm />
      </div>

      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 border-8 border-black">
          <Image
            src="/signup/Malakai030_11.jpg"
            alt="Crystal art"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  )
}

