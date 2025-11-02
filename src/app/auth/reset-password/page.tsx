"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h1>
          <p className="mb-6 text-gray-600">
            Enter the OTP sent to {email} and your new password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="mt-4">
            <button
              onClick={() => router.push("/auth/forgot-password")}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Resend OTP
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
