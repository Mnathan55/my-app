"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const KYCForm: React.FC = () => {
  const { data: session } = useSession();
  const [pan, setPan] = useState("");
  const [adhar, setAdhar] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePan = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAdhar = (adhar: string) => {
    const adharRegex = /^\d{12}$/;
    return adharRegex.test(adhar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Please log in to submit KYC");
      return;
    }

    if (!validatePan(pan)) {
      toast.error("Invalid PAN format. Should be 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)");
      return;
    }

    if (!validateAdhar(adhar)) {
      toast.error("Invalid Aadhaar format. Should be 12 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pan, adhar }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      toast.success("KYC submitted successfully!");
      setPan("");
      setAdhar("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit KYC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">KYC Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pan" className="block text-sm font-medium text-gray-300">
            PAN Card Number
          </label>
          <input
            type="text"
            id="pan"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="ABCDE1234F"
            required
          />
        </div>
        <div>
          <label htmlFor="adhar" className="block text-sm font-medium text-gray-300">
            Aadhaar Card Number
          </label>
          <input
            type="text"
            id="adhar"
            value={adhar}
            onChange={(e) => setAdhar(e.target.value.replace(/\D/g, ""))}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="123456789012"
            maxLength={12}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
      </form>
    </div>
  );
};

export default KYCForm;
