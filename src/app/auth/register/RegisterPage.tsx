"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/auth/login");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
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
        <button className="bg-indigo-800 text-white px-3 py-1 rounded-lg text-sm">
          English ▾
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <img
            src="/assets/stackwallet-logo.png"
            alt="Stack Wallet Logo"
            className="w-24 h-24 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h1>
          <p className="mb-6 text-gray-600">Sign up to get started</p>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500"
            >
              Register
            </button>
          </form>

          <div className="my-4 text-gray-400">OR</div>

          <button
            onClick={() => router.push("/auth/login")}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Back to Login
          </button>
        </div>
      </main>

      <footer className="text-center text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} Stack Wallet — making Web3 accessible.
      </footer>
    </div>
  );
}