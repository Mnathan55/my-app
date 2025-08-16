"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [chain, setChain] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);

  // Fetch user data
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
          wallets: data.wallets.map((w: any) => ({
            ...w,
            balance: w.balance.toString(),
            transactions: w.transactions.map((tx: any) => ({
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

  // Handle adding wallet
  const handleAddWallet = async () => {
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

  if (loading) return <p className="text-white">Loading user...</p>;
  if (!user) return <p className="text-white">User not found</p>;

  return (
    <div className="p-6 bg-[#111] min-h-screen text-white">
      <h1 className="text-2xl font-bold">{user.name || "No Name"}</h1>
      <p>{user.email}</p>

      {/* Add Wallet Form */}
      <div className="border text-white p-4 my-4 rounded-md bg-gray-800">
        <h2 className="text-lg font-semibold mb-2">Add Wallet</h2>
        <select
          className="block mb-2 p-2 rounded bg-gray-700 text-white"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          required
        >
          <option value="">Select Coin</option>
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="tron">Tron</option>
          <option value="tether">Tether</option>
          <option value="dogecoin">Dogecoin</option>
        </select>

        <input
          className="block mb-2 p-2 rounded text-white"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="block mb-2 p-2 rounded text-white"
          type="text"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddWallet}
        >
          Add Wallet
        </button>
      </div>

      {/* Display Wallets */}
      {user.wallets.map((wallet) => {
        const isEditing = editingWalletId === wallet.id;

        return (
          <div
            key={wallet.id}
            className="border p-4 my-4 rounded-md bg-gray-900"
          >
            <h2 className="text-lg font-semibold">
              {wallet.chain} - {wallet.address}
            </h2>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={wallet.balance}
                    onChange={(e) => {
                      const newBalance = e.target.value;
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
                    }}
                    className="p-1 rounded text-white"
                  />
                  <button
                    onClick={async () => {
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
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingWalletId(null)}
                    className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>Balance: {wallet.balance}</p>
                  <button
                    onClick={() => setEditingWalletId(wallet.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            <h3 className="mt-2 font-bold">Transactions:</h3>
            {wallet.transactions.length === 0 ? (
              <p className="text-gray-400">No transactions</p>
            ) : (
              <ul className="list-disc list-inside">
                {wallet.transactions.map((tx) => (
                  <li key={tx.id}>
                    {tx.type} — {tx.amount} —{" "}
                    {new Date(tx.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminUserPage;
