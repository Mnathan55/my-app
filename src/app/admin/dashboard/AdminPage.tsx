"use client";
//src/app/admin/dashboard/AdminPage.tsx
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
    return <p className="text-center text-white">Loading users...</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-[#111] border border-gray-700 rounded-lg">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Wallets</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="cursor-pointer hover:bg-gray-700"
              onClick={() => router.push(`/admin/user/${user.id}`)}
            >
              <td className="p-3">{user.name || "No Name"}</td>
              <td className="p-3">{user.email || "No Email"}</td>
              <td className="p-3">{user.wallets.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default AdminDashboard;