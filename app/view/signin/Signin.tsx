import SignInForm from "./sign-in-form";

export default function SignIn() {
  return (
    <main className="flex min-h-screen bg-background overflow-hidden">
      <div className="w-[100vw] h-[100vh] lg:w-[420px] min-w-[320px] lg:min-w-[420px] relative z-10">
        <SignInForm />
      </div>

      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 border-8 border-black">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login.jpg-mmOgTOz7a1oc3pBIBkPjoOECHtPGl8.jpeg"
            alt="Crystal art"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>
  )
}

