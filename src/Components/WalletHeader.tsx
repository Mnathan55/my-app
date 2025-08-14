"use client";

import { useSession } from "next-auth/react";

export default function WalletHeader() {
  const { data: session } = useSession();

  if (!session) return <div className="p-4">Not signed in</div>;

  return (
        <header className="flex items-center justify-between w-full bg-[#111] text-white p-4">

      <div className="text-xl font-bold">{session.user?.name}</div>
      <div className="text-sm text-gray-400">{session.user?.email}</div>
    </header>
  );
}
