"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function AdminDashboard() {
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
    return <p className="text-center text-white">Loading users...</p>;
  }

  return (
    <div className="p-6 text-white min-h-screen bg-[#0d0d0d]">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Dashboard</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111] shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Wallets
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => router.push(`/admin/user/${user.id}`)}
                className="hover:bg-gray-800 transition duration-150 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {user.name || "No Name"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {user.email || "No Email"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-600 text-white">
                    {user.wallets.length} Wallet{user.wallets.length !== 1 && "s"}
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
