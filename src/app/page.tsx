"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function StackWalletLanding(){
  const router = useRouter();
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 font-sans">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo / Name on the left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#052e2a" />
              <path d="M6 12h12" stroke="#bfe5d7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold">Stack Wallet</div>
          </div>
        </div>

        {/* Language dropdown */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-full bg-emerald-900 text-emerald-50 text-sm">English ▾</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Big headline + copy + button */}
          <section className="md:col-span-7">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl leading-none font-extrabold tracking-tight text-emerald-900"
              style={{ fontFamily: 'Oswald, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
            >
              WELCOME TO
              <br />
              <span className="inline-block">STACK WALLET</span>
            </h1>

            <p className="mt-8 max-w-xl text-slate-700">
              Trusted by millions, Stack Wallet is a secure wallet making the world of web3 accessible to all.
            </p>

            <div className="mt-8">
              <a
              onClick={()=>router.push("/auth/login")}
                className="inline-block bg-white text-emerald-900 font-medium px-6 py-3 rounded-full shadow hover:shadow-lg transition-shadow"
              >
                GET STARTED →
              </a>
            </div>
          </section>

          {/* Right: Artwork / mascot */}
          <aside className="md:col-span-5 flex justify-end">
            <div className="w-full max-w-md md:max-w-lg">
              <div className="relative">
                <div className="absolute -right-12 -top-8 w-[260px] h-[360px] md:w-[360px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl transform rotate-6 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-200"></div>

                <img
                  alt="stack-art"
                  src="/assets/welcome-art.png"
                  className="relative w-full h-auto rounded-2xl shadow-xl object-cover"
                />

                <div className="hidden md:block absolute left-0 bottom-0 w-56 h-56 transform -translate-x-24 translate-y-10 rotate-12 bg-indigo-200 opacity-30 rounded"></div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-600">
        <div className="border-t pt-6">© {new Date().getFullYear()} Stack Wallet — making Web3 accessible.</div>
      </footer>
    </div>
  );
}