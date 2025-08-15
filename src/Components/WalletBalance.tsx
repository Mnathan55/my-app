"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";

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
      </div>
    </div>
  );
}
