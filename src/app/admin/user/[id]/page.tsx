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

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/user/${id}`, { credentials: "include" });
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

      // Update local state
      setUser((prev) => prev && { ...prev, wallets: [...prev.wallets, { ...newWallet, balance: newWallet.balance.toString(), transactions: [] }] });

      // Reset form
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
    <div className="p-6 bg-[#111] h-screen text-white">
      <h1 className="text-2xl font-bold">{user.name || "No Name"}</h1>
      <p>{user.email}</p>

      {/* Add Wallet Form */}
      <div className="border text-white p-4 my-4 rounded-md bg-gray-800">
        <h2 className="text-lg font-semibold mb-2">Add Wallet</h2>
        <input
          className="block mb-2 p-2 rounded"
          type="text"
          placeholder="Chain"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        />
        <input
          className="block mb-2 p-2 rounded"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="block mb-2 p-2 rounded"
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
      {user.wallets.map((wallet) => (
        <div key={wallet.id} className="border p-4 my-4 rounded-md bg-gray-900">
          <h2 className="text-lg font-semibold">{wallet.chain} - {wallet.address}</h2>
          <p>Balance: {wallet.balance}</p>
          <h3 className="mt-2 font-bold">Transactions:</h3>
          {wallet.transactions.length === 0 ? (
            <p className="text-gray-400">No transactions</p>
          ) : (
            <ul className="list-disc list-inside">
              {wallet.transactions.map((tx) => (
                <li key={tx.id}>
                  {tx.type} — {tx.amount} — {new Date(tx.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUserPage;
