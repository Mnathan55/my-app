"use client";
// app/dashboard/coin/[id]/page.tsx

import { DottedLineChart } from "@/Components/UI/dotted-line";
import { useParams } from "next/navigation";
import CoinInfo from "./CoinInfo";

export default function CoinChartPage() {
  const params = useParams();
  const coinId = String(params.id);

  return (
    <main className="p-2 space-y-6 bg-[#0a0a0a]">
      <div className="max-w-3xl bg-[#111] w-full mx-auto flex flex-col items-center">
        <DottedLineChart coinId={coinId} currency="usd"/>
        <CoinInfo id={coinId} />
      </div>
    </main>
  );
}
