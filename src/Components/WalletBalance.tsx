"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  PaperAirplaneIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function WalletBalance() {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [showBalance, setShowBalance] = useState(true);

  // Uncomment to fetch from database
  // useEffect(() => {
  //   async function loadBalances() {
  //     try {
  //       const wallets = await prisma.wallet.findMany({ select: { balance: true } });
  //       const sum = wallets.reduce((acc, w) => acc + Number(w.balance), 0);
  //       setTotalBalance(sum);
  //     } catch (error) {
  //       console.error("Error fetching wallets:", error);
  //     }
  //   }
  //   loadBalances();
  // }, []);

  return (
    <div className="bg-[#111] px-4 md:px-10 lg:px-20 py-4 text-white w-full text-center rounded-lg">
      {/* Balance Display */}
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

      {/* Actions */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        <ActionButton icon={<ArrowPathIcon className="w-6 h-6" />} label="Buy/Sell" />
        <ActionButton icon={<ArrowsRightLeftIcon className="w-6 h-6" />} label="Swap" />
        <ActionButton icon={<PaperAirplaneIcon className="w-6 h-6" />} label="Send" />
        <ActionButton icon={<QrCodeIcon className="w-6 h-6" />} label="Receive" />
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col p-4 items-center justify-center bg-[#1a1a1a] rounded-lg py-3 hover:bg-[#222] transition">
      <div className="text-gray-300">{icon}</div>
      <span className="text-sm mt-1">{label}</span>
    </button>
  );
}
