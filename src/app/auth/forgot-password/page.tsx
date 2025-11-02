"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: reset password
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP generated successfully!");
        setOtp(data.otp); // Pre-fill OTP for convenience
        setStep(2);
      } else {
        toast.error(data.error || "Failed to generate OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully!");
        router.push("/auth/login");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <img
            src="/assets/stackwallet-logo.png"
            alt="Stack Wallet Logo"
            className="w-24 h-24 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>

          {step === 1 ? (
            <>
              <p className="mb-6 text-gray-600">
                Enter your email address to reset your password.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Enter your new password for {email}.
              </p>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full border rounded-lg px-3 py-2 text-center text-lg tracking-widest"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <div className="mt-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} Stack Wallet — making Web3 accessible.
      </footer>
    </div>
  );
}
