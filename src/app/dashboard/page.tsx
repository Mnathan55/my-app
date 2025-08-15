"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TabbedSection from "../../Components/TabbedSection";
import WalletBalance from "../../Components/WalletBalance";
import WalletHeader from "../../Components/WalletHeader";

interface Wallet {
  id: string;
  chain: string;
  address: string;
  balance: string;
  transactions: any[];
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
    <main className="max-w-3xl w-full mx-auto flex flex-col items-center">
      <WalletHeader />
      <WalletBalance/>
      <TabbedSection wallets={wallets} setWallets={setWallets} />
    </main>
  );
}
