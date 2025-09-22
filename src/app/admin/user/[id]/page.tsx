"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  createdAt: string;
}

interface Wallet {
  id: string;
  chain: string;
  address: string;
  balance: string;
  transactions: Transaction[];
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  wallets: Wallet[];
}

const AdminUserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [chain, setChain] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);

  // ✅ disallow negatives and ensure a proper decimal > 0
  const isPositiveDecimal = (v: string) =>
    /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(v) && parseFloat(v) > 0;

  // ✅ block bad keys for number inputs (e/E/+/-)
  const blockInvalidNumberKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  // ✅ Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/user/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        const formattedUser = {
          ...data,
          wallets: data.wallets.map((w: Wallet) => ({
            ...w,
            balance: w.balance.toString(),
            transactions: w.transactions.map((tx: Transaction) => ({
              ...tx,
              amount: tx.amount.toString(),
            })),
          })),
        };
        setUser(formattedUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  // ✅ Handle adding wallet
  const handleAddWallet = async () => {
    if (!chain) return toast.error("Please select a coin.");
    if (!address.trim()) return toast.error("Please enter an address.");
    if (!isPositiveDecimal(balance))
      return toast.error("Balance must be a positive number.");

    try {
      const res = await fetch(`/api/admin/user/${id}/wallets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain, address, balance }),
      });
      if (!res.ok) throw new Error("Failed to add wallet");
      const newWallet = await res.json();

      setUser(
        (prev) =>
          prev && {
            ...prev,
            wallets: [
              ...prev.wallets,
              {
                ...newWallet,
                balance: newWallet.balance.toString(),
                transactions: [],
              },
            ],
          }
      );

      setChain("");
      setAddress("");
      setBalance("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center bg-[#111] min-h-screen text-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  if (!user) return <p className="text-white">User not found</p>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-gray-100">
      {/* Header with Back + Logout */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 transition"
        >
          <FiArrowLeft /> Back
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-sm text-white hover:bg-red-700 transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold text-indigo-400 mb-2">
        {user.name || "No Name"}
      </h1>
      <p className="text-gray-400 mb-6">{user.email}</p>

      {/* Add Wallet Form */}
      <div className="rounded-xl border border-gray-800 bg-[#111] p-6 mb-8 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">
          Add Wallet
        </h2>
        <div className="space-y-3">
          <select
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring focus:ring-indigo-500 text-sm"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
          >
            <option value="">Select Coin</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="tron">Tron</option>
            <option value="tether">Tether</option>
            <option value="dogecoin">Dogecoin</option>
            <option value="dogecoin">Dogecoin</option>
            <option value="solana">Solana</option>
            <option value="ripple">XRP</option>
            <option value="avalanche-2">Avalanche</option>
            <option value="litecoin">Litecoin</option>
            <option value="binancecoin">BNB</option>
            <option value="polkadot">Polkadot</option>
          </select>

          <input
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring focus:ring-indigo-500 text-sm"
            type="text"
            placeholder="Wallet Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring focus:ring-indigo-500 text-sm"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="Balance"
            value={balance}
            onKeyDown={blockInvalidNumberKeys}
            onChange={(e) => setBalance(e.target.value.trim())}
          />

          <button
            className="w-full bg-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            onClick={handleAddWallet}
          >
            Add Wallet
          </button>
        </div>
      </div>

      {/* Wallets */}
      <div className="space-y-6">
        {user.wallets.map((wallet) => {
          const isEditing = editingWalletId === wallet.id;

          return (
            <div
              key={wallet.id}
              className="rounded-xl border border-gray-800 bg-[#111] p-6 shadow-md"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-indigo-400">
                  {wallet.chain}
                </h2>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-300">
                  {wallet.address}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      min="0"
                      value={wallet.balance}
                      onKeyDown={blockInvalidNumberKeys}
                      onChange={(e) => {
                        const newBalance = e.target.value;
                        if (
                          newBalance === "" ||
                          isPositiveDecimal(newBalance)
                        ) {
                          setUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  wallets: prev.wallets.map((w) =>
                                    w.id === wallet.id
                                      ? { ...w, balance: newBalance }
                                      : w
                                  ),
                                }
                              : null
                          );
                        }
                      }}
                      className="p-2 rounded bg-gray-800 border border-gray-700 text-sm"
                    />
                    <button
                      onClick={async () => {
                        if (!isPositiveDecimal(wallet.balance)) {
                          alert("Balance must be a positive number.");
                          return;
                        }
                        try {
                          const res = await fetch(
                            `/api/admin/user/${id}/wallets/${wallet.id}`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                balance: wallet.balance,
                              }),
                            }
                          );
                          if (!res.ok)
                            throw new Error("Failed to update balance");
                          const updated = await res.json();
                          setUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  wallets: prev.wallets.map((w) =>
                                    w.id === wallet.id
                                      ? {
                                          ...w,
                                          balance: updated.balance.toString(),
                                        }
                                      : w
                                  ),
                                }
                              : null
                          );
                          setEditingWalletId(null);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="bg-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingWalletId(null)}
                      className="bg-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm">
                      Balance:{" "}
                      <span className="text-indigo-400">{wallet.balance}</span>
                    </p>
                    <button
                      onClick={() => setEditingWalletId(wallet.id)}
                      className="bg-indigo-600 px-3 py-1 rounded-lg text-sm hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          !confirm(
                            "Are you sure you want to delete this wallet?"
                          )
                        )
                          return;
                        try {
                          const res = await fetch(
                            `/api/admin/user/${id}/wallets/${wallet.id}`,
                            { method: "DELETE" }
                          );
                          if (!res.ok)
                            throw new Error("Failed to delete wallet");

                          // update local state after successful delete
                          setUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  wallets: prev.wallets.filter(
                                    (w) => w.id !== wallet.id
                                  ),
                                }
                              : null
                          );

                          toast.success("Wallet deleted successfully");
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to delete wallet");
                        }
                      }}
                      className="bg-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Transactions */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-300 text-sm mb-2">
                  Transactions
                </h3>
                {wallet.transactions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No transactions</p>
                ) : (
                  <ul className="space-y-1 text-sm text-gray-400">
                    {wallet.transactions.map((tx) => (
                      <li key={tx.id} className="bg-gray-800/50 p-2 rounded-md">
                        <span className="font-medium text-white">
                          {tx.type}
                        </span>{" "}
                        — {tx.amount} —{" "}
                        {new Date(tx.createdAt).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUserPage;
