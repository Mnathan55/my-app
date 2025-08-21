"use client";

import { ArrowPathIcon, ArrowsRightLeftIcon, EyeIcon, EyeSlashIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import { QrCodeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/dashboard/sell")} className="flex flex-col px-9 items-center justify-center bg-[#F0F0F0] cursor-pointer rounded-lg py-3 hover:bg-[#e6e6e6] transition">
      <div className="text-black">{icon}</div>
      <span className="text-md font-semibold text-black mt-1">{label}</span>
    </button>
  );
}

export default function WalletBalance() {
  
  const totalBalance = useSelector(
    (state: RootState) => state.totalBalance.value
  );
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-[#111] px-4 md:px-10 lg:px-20 py-4 text-white w-full text-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold">
            {showBalance ? `$${totalBalance.toFixed(2)}` : "••••"}
          </span>
          <button
            className="p-1 rounded-lg hover:bg-gray-800"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <EyeIcon className="w-6 h-6 text-gray-400" />
            ) : (
              <EyeSlashIcon className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
        <div className="flex flex-row justify-center items-center mt-4">
          <ActionButton
            icon={<ArrowPathIcon className="w-8 h-8" />}
            label="Sell"
          />
        </div>
      </div>
    </div>
  );
}
