"use client";
// app/dashboard/coin/[id]/page.tsx

import { DottedLineChart } from "../../../../Components/UI/dotted-line";
import { useParams, useRouter } from "next/navigation";
import CoinInfo from "./CoinInfo";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function CoinChartPage() {
  const params = useParams();
  const coinId = String(params.id);
  const router = useRouter();

  return (
    <main className="min-h-screen p-4 bg-[#0a0a0a] text-white">
      {/* Header with Back + Logout */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors"
          >
            <FiArrowLeft /> Back
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-sm text-white hover:bg-red-700 transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-[#111] rounded-xl p-6 shadow-lg border border-gray-800">
          <DottedLineChart coinId={coinId} currency="usd" />
          <div className="mt-6">
            <CoinInfo id={coinId} />
          </div>
        </div>
      </div>
    </main>
  );
}