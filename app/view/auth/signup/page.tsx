'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getImageUrl } from '@/routes/imageroute';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const isValid = /\S+@\S+\.\S+/.test(email) && pw.length >= 8 && agree;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // TODO: call your API
    console.log({ email, pw, agree });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-2">
        {/* Left: form */}
        <section className="relative flex items-center justify-center px-6 py-10 md:px-10">
          <div className="absolute left-6 top-6 md:left-10 md:top-10">
            <Image
              src={getImageUrl('core', 'logo')}
              alt="WildMind"
              width={36}
              height={36}
              className="h-9 w-9"
            />
          </div>

          <div className="w-full max-w-md">
            <header className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome to WildMind!
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Sign up to access the platform.
              </p>
            </header>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-neutral-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-600 focus:border-neutral-700 focus:outline-none"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-neutral-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter Password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 pr-10 text-sm outline-none placeholder:text-neutral-600 focus:border-neutral-700"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-neutral-500"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {/* eye icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      {showPw ? (
                        <path d="M3.53 2.47 2.47 3.53 6.3 7.36C4.54 8.38 3.12 9.88 2 12c2.27 4.38 6.14 7 10 7 2 0 3.9-.6 5.57-1.68l3.9 3.9 1.06-1.06L3.53 2.47zM12 17c-3.11 0-6.22-2.02-8.09-5 1-1.68 2.48-3.01 4.15-3.86l2.07 2.07A3.5 3.5 0 0 0 12 15.5c.5 0 .98-.1 1.41-.29l1.78 1.78A8.4 8.4 0 0 1 12 17zm8.09-5a14.5 14.5 0 0 0-4.41-4.12l-1.9 1.9A3.48 3.48 0 0 1 12 8.5c-.49 0-.95.1-1.37.27l-1.6-1.6A9.23 9.23 0 0 1 12 7c3.86 0 7.73 2.62 10 7-.36.7-.78 1.36-1.24 1.98l-1.44-1.44c.53-.74.99-1.53 1.37-2.54z" />
                      ) : (
                        <path d="M12 5c-3.86 0-7.73 2.62-10 7 2.27 4.38 6.14 7 10 7s7.73-2.62 10-7c-2.27-4.38-6.14-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                      )}
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500">Use 8+ characters.</p>
              </div>

              {/* Terms */}
              <label className="flex select-none items-start gap-3 text-xs text-neutral-400">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 accent-blue-600"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I agree to the{' '}
                  <Link href="/legal/terms" className="underline hover:text-neutral-200">
                    terms &amp; policy
                  </Link>
                </span>
              </label>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={!isValid}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition enabled:hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Signup
              </button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-px w-full bg-neutral-800" />
                </div>
                <div className="relative mx-auto w-fit bg-neutral-950 px-3 text-xs text-neutral-500">
                  Or
                </div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm hover:border-neutral-700"
                >
                  <GoogleIcon className="h-4 w-4" />
                  Sign in with Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm hover:border-neutral-700"
                >
                  <AppleIcon className="h-4 w-4" />
                  Sign in with Apple
                </button>
              </div>

              {/* Switch to sign-in */}
              <p className="pt-2 text-center text-sm text-neutral-400">
                Have an account?{' '}
                <Link href="/signin" className="text-blue-400 underline hover:text-blue-300">
                  Sign In
                </Link>
              </p>

              {/* Legal + cookies */}
              <p className="pt-6 text-center text-xs leading-5 text-neutral-500">
                By continuing, you agree to WildMind’s{' '}
                <Link href="/legal/terms" className="underline">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
                <br />
                <Link href="/cookies" className="mt-1 inline-block underline">
                  Cookies Settings
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* Right: image */}
        <aside className="relative hidden overflow-hidden md:block">
          {/* Replace src with your asset in /public */}
          <Image
            src="/Core/logosquare.png"
            alt="Cute stylized character"
            fill
            priority
            className="object-cover"
            sizes="(min-width: auto) 50vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-neutral-950/80 to-transparent" />
          <div className="absolute bottom-6 right-6 rounded-xl bg-black/40 px-4 py-2 text-xs text-white backdrop-blur">
            <span className="block opacity-80">Generated by</span>
            <span className="font-medium">Ronald Richards</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* --- Icons --- */
function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 12.227c0-.64-.058-1.254-.167-1.84H12v3.48h5.4a4.61 4.61 0 0 1-2 3.023v2.51h3.24c1.897-1.747 2.96-4.317 2.96-7.173z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.968-.9 6.624-2.44l-3.24-2.51c-.9.6-2.05.96-3.384.96-2.603 0-4.81-1.757-5.596-4.12H3.02v2.59A10 10 0 0 0 12 22z"
        opacity=".6"
      />
      <path
        fill="currentColor"
        d="M6.404 13.89A6.01 6.01 0 0 1 6.09 12c0-.657.113-1.292.314-1.89V7.52H3.02A9.99 9.99 0 0 0 2 12c0 1.62.39 3.154 1.02 4.48l3.384-2.59z"
        opacity=".6"
      />
      <path
        fill="currentColor"
        d="M12 5.98c1.47 0 2.79.507 3.83 1.5l2.874-2.874C16.963 2.878 14.696 2 12 2 8.99 2 6.36 3.74 4.404 6.11L7.79 8.7C8.58 6.337 10.79 4.58 12 4.58z"
        opacity=".6"
      />
    </svg>
  );
}

function AppleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.45 2.188-1.18 2.952-.75.79-1.98 1.39-3.1 1.3-.14-1.1.49-2.257 1.22-3.027.77-.8 2.08-1.37 3.06-1.225z" />
      <path d="M20.02 17.06c-.39.9-.58 1.29-1.08 2.08-.7 1.08-1.69 2.42-2.92 2.43-1.09.01-1.37-.71-2.86-.71-1.5 0-1.81.7-2.9.72-1.23.03-2.24-1.23-2.94-2.31C5.11 17.78 4 14.19 5.39 11.59c.86-1.62 2.38-2.64 4.03-2.66 1.28-.02 2.49.74 2.86.74.36 0 1.84-.91 3.1-.77.53.02 2.03.21 3 1.63-2.55 1.43-2.14 5.17.64 6.53z" />
    </svg>
  );
}
