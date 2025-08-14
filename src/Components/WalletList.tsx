"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Wallet {
  id: string;
  chain: string;
  address: string;
  balance: string;
  transactions: any[];
}

const WalletList = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id; // ✅ get userId from session

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openWalletId, setOpenWalletId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [chain, setChain] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!userId) return; // wait until session is loaded
    fetch(`/api/wallet?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setWallets(data));
  }, []);

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const res = await fetch(`/api/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, chain, address }),
      });
      if (!res.ok) throw new Error("Failed to add wallet");
      const wallet = await res.json();
      setWallets((prev) => [...prev, wallet]);
      setChain("");
      setAddress("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!userId) return <p>User not logged in</p>;

  return (
    <div className="p-4 bg-[#111] rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3">Wallets</h2>
      <ul className="space-y-3">
        {wallets.map((wallet) => (
          <li key={wallet.id} className="border p-3 rounded bg-gray-900">
            <div className="flex justify-between">
              <span>{wallet.chain}</span>
              <span>Balance : {wallet.balance} $</span>
            </div>
            <p
              className="text-xs break-all cursor-pointer mt-1"
              onClick={() => setOpenWalletId(openWalletId === wallet.id ? null : wallet.id)}
            >
              {wallet.address}
            </p>
          </li>
        ))}
      </ul>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close" : "Add Wallet"}
      </button>

      {showForm && (
        <form onSubmit={handleAddWallet} className="mt-2 flex flex-col gap-2">
          <input
            placeholder="Chain"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="p-2 rounded bg-[#222]"
            required
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-2 rounded bg-[#222]"
            required
          />
          <button type="submit" className="bg-green-600 p-2 rounded mt-1">
            Add Wallet
          </button>
        </form>
      )}
    </div>
  );
};

export default WalletList;
