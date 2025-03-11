import SignUpForm from "./sign-up-form"

export default function SignUp() {
  return (
    <main className="flex min-h-screen bg-background overflow-hidden">
      <div className="w-full lg:w-[420px] min-w-[320px] lg:min-w-[420px] relative z-10">
        <SignUpForm />
      </div>

      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 border-8 border-black">
          <img
            src="/signup/Malakai030_11.png"
            alt="Artistic warriors"
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </main>
  )
}

