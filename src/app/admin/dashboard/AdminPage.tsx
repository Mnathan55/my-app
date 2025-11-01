"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast"; // make sure you have this installed

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
  kycStatus: string;
  adhar?: string | null;
  pan?: string | null;
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

  async function handleDeleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/user/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.id !== userId)); // remove from UI instantly
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  }

  async function handleApproveKyc(userId: string) {
    try {
      const res = await fetch(`/api/admin/kyc/${userId}/approve`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to approve KYC");

      toast.success("KYC approved successfully");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, kycStatus: "APPROVED" } : u
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve KYC");
    }
  }

  async function handleRejectKyc(userId: string) {
    try {
      const res = await fetch(`/api/admin/kyc/${userId}/reject`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to reject KYC");

      toast.success("KYC rejected successfully");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, kycStatus: "REJECTED" } : u
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject KYC");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111] text-gray-300">
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
                Aadhaar
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                PAN
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                Wallets
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                KYC Status
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors duration-200 hover:bg-gray-800/60"
              >
                <td
                  className="p-4 text-sm font-medium text-gray-200 cursor-pointer"
                  onClick={() => router.push(`/admin/user/${user.id}`)}
                >
                  {user.name || (
                    <span className="italic text-gray-500">No Name</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-400 cursor-pointer"
                    onClick={() => router.push(`/admin/user/${user.id}`)}>
                  {user.email || (
                    <span className="italic text-gray-500">No Email</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {user.adhar || (
                    <span className="italic text-gray-500">Not Provided</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {user.pan || (
                    <span className="italic text-gray-500">Not Provided</span>
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
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.kycStatus === "APPROVED"
                          ? "bg-green-500/20 text-green-400"
                          : user.kycStatus === "REJECTED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {user.kycStatus}
                    </span>
                    {user.kycStatus === "PENDING" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleApproveKyc(user.id)}
                          className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectKyc(user.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition"
                  >
                    <FiTrash2 className="text-sm" />
                    Delete
                  </button>
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
