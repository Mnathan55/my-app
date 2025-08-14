"use client";

import React, { useEffect, useState } from "react";

interface CoinInfoProps {
  id: string; // e.g., "bitcoin"
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  description?: {
    en: string;
  };
  image?: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data?: {
    current_price: {
      [currency: string]: number;
    };
    market_cap: {
      [currency: string]: number;
    };
    high_24h: {
      [currency: string]: number;
    };
    low_24h: {
      [currency: string]: number;
    };
    price_change_percentage_24h: number;
  };
  genesis_date?: string | null;
  links?: {
    homepage: string[];
  };
}

const CoinInfo: React.FC<CoinInfoProps> = ({ id }) => {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoin() {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        if (!res.ok) throw new Error("Failed to fetch coin data");
        const data: Coin = await res.json();
        setCoin(data);
      } catch (err: unknown) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchCoin();
  }, [id]);

  if (loading) return <div className="text-center text-sm">Loading coin info...</div>;
  if (error || !coin) return <div className="text-red-500 text-sm">Error loading coin.</div>;

  // TS now knows coin is not null below
  return (
    <div className=" w-full p-4 md:p-6 space-y-5 text-white dark:border-zinc-800">
  {/* Header */}
  <div className="flex items-center gap-4">
    {coin.image?.small && (
      <img
        src={coin.image.small}
        alt={`${coin.name} logo`}
        className="w-12 h-12 rounded-full shadow"
      />
    )}
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {coin.name}{" "}
        <span className="text-gray-500 dark:text-gray-400">
          ({coin.symbol.toUpperCase()})
        </span>
      </h1>
      {coin.genesis_date && (
        <p className="text-sm text-gray-500">
          Launched: {coin.genesis_date}
        </p>
      )}
    </div>
  </div>

  {/* Description */}
  {coin.description?.en && (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      {coin.description.en.split(". ")[0] + "."}
    </p>
  )}

  {/* Market Data */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
      <p className="text-black">Current Price</p>
      <p className="text-lg font-semibold">
        {coin.market_data?.current_price?.usd
          ? `$${coin.market_data.current_price.usd.toLocaleString()}`
          : "N/A"}
      </p>
    </div>

    <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
      <p className="text-black">Market Cap</p>
      <p className="text-lg font-semibold">
        {coin.market_data?.market_cap?.usd
          ? `$${coin.market_data.market_cap.usd.toLocaleString()}`
          : "N/A"}
      </p>
    </div>

    <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
      <p className="text-black">24h High</p>
      <p className="text-lg font-semibold">
        {coin.market_data?.high_24h?.usd
          ? `$${coin.market_data.high_24h.usd.toLocaleString()}`
          : "N/A"}
      </p>
    </div>

    <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
      <p className="text-black">24h Low</p>
      <p className="text-lg font-semibold">
        {coin.market_data?.low_24h?.usd
          ? `$${coin.market_data.low_24h.usd.toLocaleString()}`
          : "N/A"}
      </p>
    </div>
  </div>

  {/* Homepage Link */}
  <div>
    <p className="text-gray-500 text-sm mb-1">Official Website</p>
    {coin.links?.homepage?.[0] ? (
      <a
        href={coin.links.homepage[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
      >
        {coin.links.homepage[0]}
      </a>
    ) : (
      <span className="text-gray-400">N/A</span>
    )}
  </div>
</div>

  );
};

export default CoinInfo;
