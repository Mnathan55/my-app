"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPageInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center shadow-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="6" fill="#312e81" />
              <path
                d="M6 12h12"
                stroke="#c7d2fe"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-white font-semibold">Stack Wallet</span>
        </div>

        <button className="bg-indigo-800 text-white px-3 py-1 rounded-lg text-sm">
          English ▾
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* You can replace this with your logo */}
          <img
            src="/assets/stackwallet-logo.png"
            alt="Stack Wallet Logo"
            className="w-24 h-24 mx-auto mb-6"
          />

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
          <p className="mb-6 text-gray-600">
            Sign in to your account
          </p>

          {error === "OAuthCallback" && (
            <p className="text-red-600 text-sm mb-4">
              Google sign-in failed. Please try again.
            </p>
          )}

          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Continue with Google
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} Stack Wallet — making Web3 accessible.
      </footer>
    </div>
  );
}
