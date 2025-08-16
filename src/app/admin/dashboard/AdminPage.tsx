"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

interface Wallet {
  id: string;
  chain: string;
  address: string;
  balance: string;
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  wallets: Wallet[];
}

function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 text-gray-100 min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a]">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-extrabold text-indigo-400">
        Admin Dashboard
      </h1>

      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
      >
        <FiLogOut className="text-lg" />
        Logout
      </button>
    </div>

      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-800 bg-[#111]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/70">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                Email
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                Wallets
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors duration-200 hover:bg-gray-800/60 cursor-pointer"
                onClick={() => router.push(`/admin/user/${user.id}`)}
              >
                <td className="p-4 text-sm font-medium text-gray-200">
                  {user.name || (
                    <span className="italic text-gray-500">No Name</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {user.email || (
                    <span className="italic text-gray-500">No Email</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.wallets.length > 0
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "bg-gray-700/50 text-gray-400"
                    }`}
                  >
                    {user.wallets.length} Wallet
                    {user.wallets.length !== 1 ? "s" : ""}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
