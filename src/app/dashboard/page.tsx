"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import TabbedSection from "../../Components/TabbedSection";
import WalletBalance from "../../Components/WalletBalance";
import WalletHeader from "../../Components/WalletHeader";
import { Transaction } from "next-auth";
import { FiLogOut } from "react-icons/fi";

interface Wallet {
  id: string;
  chain: string;
  address: string;
  balance: string;
  transactions: Transaction[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/wallet?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setWallets(data))
      .catch(console.error);
  }, [userId]);

  return (
    <main className="w-full bg-black">
      <div className="max-w-2xl bg-[#111] w-full overflow-x-hidden mx-auto flex flex-col items-center">
        {/* Top header with logout button */}
        <div className="w-full px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-400">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>

        <WalletHeader />
        <WalletBalance />
        <TabbedSection wallets={wallets} setWallets={setWallets} />
      </div>
    </main>
  );
}
