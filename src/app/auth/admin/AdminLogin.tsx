"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("admin-login", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin/dashboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-900 flex flex-col">
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center shadow-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <img
            src="/assets/stackwallet-logo.png"
            alt="Stack Wallet Logo"
            className="w-24 h-24 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Portal</h1>
          <p className="mb-6 text-gray-600">Sign in to admin dashboard</p>
          
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500"
            >
              Sign in as Admin
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} Stack Wallet — making Web3 accessible.
      </footer>
    </div>
  );
}