"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Wallet } from "next-auth";
import { useDispatch } from "react-redux";
import { setTotalBalance } from "../store/totalBalanceSlice"; // adjust path if needed

interface WalletListProps {
  wallets: Wallet[];
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
}

const WalletList: React.FC<WalletListProps> = ({ wallets, setWallets }) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const userId = session?.user?.id;

  const [prices, setPrices] = useState<Record<string, number>>({});
  const [openWalletId, setOpenWalletId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [chain, setChain] = useState("");
  const [address, setAddress] = useState("");

  // Fetch prices and update total balance
  useEffect(() => {
    const ids = wallets
      .map((w) => w.chain.toLowerCase())
      .filter(Boolean)
      .join(",");

    if (!ids) return;

    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    )
      .then((res) => res.json() as Promise<Record<string, { usd: number }>>)
      .then((data) => {
        const priceMap: Record<string, number> = {};
        let totalUSD = 0;

        for (const [coinId, priceData] of Object.entries(data)) {
          priceMap[coinId] = priceData.usd;
        }

        // Calculate total USD value from all wallets
        totalUSD = wallets.reduce((sum, wallet) => {
          const price = priceMap[wallet.chain.toLowerCase()] || 0;
          return sum + Number(wallet.balance) * price;
        }, 0);

        setPrices(priceMap);
        dispatch(setTotalBalance(totalUSD)); // ✅ Store in Redux
      })
      .catch((err) => console.error("Price fetch error:", err));
  }, [wallets, dispatch]);

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
    <div className="p-4 bg-[#111] text-white">
      <h2 className="text-xl font-bold mb-3">Wallets</h2>
      <ul className="space-y-3">
        {wallets.map((wallet) => {
          const price = prices[wallet.chain.toLowerCase()] || 0;
          const convertedValue = price
            ? (Number(wallet.balance) * price).toFixed(2)
            : "0.00";

          return (
            <li
              key={wallet.id}
              className="border border-gray-700 p-4 bg-gray-900 shadow hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-center">
                {/* Chain & Price */}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white">
                    {wallet.chain}
                  </span>
                  <span className="text-sm text-gray-400">
                    ${price.toLocaleString() ?? "—"} USD
                  </span>
                </div>

                {/* Balance */}
                <div className="text-right">
                  <span className="text-white font-semibold">
                    {Number(wallet.balance).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 block">
                    ({Number(convertedValue).toLocaleString()} $)
                  </span>
                </div>
              </div>

              {/* Address (click to toggle) */}
              <p
                className="text-xs break-all text-gray-400 cursor-pointer mt-2 hover:text-gray-200 transition-colors duration-150"
                onClick={() =>
                  setOpenWalletId(openWalletId === wallet.id ? null : wallet.id)
                }
              >
                Address:{" "}
                {openWalletId === wallet.id
                  ? wallet.address
                  : wallet.address.slice(0, 6) +
                    "..." +
                    wallet.address.slice(-4)}
              </p>
            </li>
          );
        })}
      </ul>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close" : "Add Wallet"}
      </button>
    </div>
  );
};

export default WalletList;
