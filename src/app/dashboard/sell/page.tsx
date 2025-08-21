"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FiatCurrencyModal from "@/Components/FiatCurrencyModal";
import { FaAngleDown } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

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

interface Asset {
  id: string;
  name: string;
  symbol: string;
  mainnet: string;
  image: string;
  receiveAddress: string;
}

const assets: Asset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    mainnet: "BTC Mainnet",
    image: "/coins/bitcoin.png",
    receiveAddress: "141LxgUA8TWQDbRPGqCx26pCJKuR7yg3pj",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    mainnet: "Ethereum Mainnet",
    image: "/coins/ethereum.png",
    receiveAddress: "0x94e2233871d9e2c86cdf3330435230a57fe3770b",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    mainnet: "Dogecoin Mainnet",
    image: "/coins/dogecoin.png",
    receiveAddress: "DJxkCjHpgj7c2bTgB5WELiaTDKuKxHUHVz",
  },
  {
    id: "tron",
    name: "TRX Tron",
    symbol: "TRX",
    mainnet: "Tron Mainnet",
    image: "/coins/tron.png",
    receiveAddress: "TQwJZfe7vjLq36mBS2JrURPz8UfTiciFGk",
  },
  {
    id: "tether",
    name: "USDT",
    symbol: "USDT",
    mainnet: "Ethereum Mainnet",
    image: "/coins/usdt.png",
    receiveAddress: "0x94e2233871d9e2c86cdf3330435230a57fe3770b",
  },
];

const topMainnets: Asset[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    mainnet: "BTC Mainnet",
    image: "/coins/bitcoin.png",
    receiveAddress: "",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    mainnet: "Ethereum Mainnet",
    image: "/coins/ethereum.png",
    receiveAddress: "",
  },
  {
    id: "bnb",
    name: "BNB Chain",
    symbol: "BNB",
    mainnet: "BNB Smart Chain",
    image: "/coins/bnb.png",
    receiveAddress: "",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    mainnet: "Solana Mainnet",
    image: "/coins/solana.png",
    receiveAddress: "",
  },
  {
    id: "matic",
    name: "Polygon",
    symbol: "MATIC",
    mainnet: "Polygon Mainnet",
    image: "/coins/matic.png",
    receiveAddress: "",
  },
];

export default function SellPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<{
    code: string;
    name: string;
    symbol: string;
    flag: string;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showFiatModal, setShowFiatModal] = useState(false);

  // fetch wallets
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/wallet?userId=${userId}`)
      .then((res) => res.json())
      .then((data: Wallet[]) => {
        setWallets(data);

        const matched = assets.filter((asset) =>
          data.some((wallet) =>
            wallet.chain.toLowerCase().includes(asset.name.toLowerCase())
          )
        );
        setFilteredAssets(matched);

        if (matched.length > 0) setSelectedAsset(matched[0]);
      })
      .catch(console.error);
  }, [userId]);

  return (
    <main className="w-full bg-black min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full h-screen md:h-[85vh] md:max-w-sm bg-gradient-to-b from-[#111] to-[#1a1a1a] md:rounded-2xl overflow-hidden shadow-xl border border-gray-800">
        {/* Header Row */}
        <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-800">
          {/* Back Button (left) */}
          <button
            onClick={() => router.back()}
            className="absolute left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <FiArrowLeft size={16} /> Back
          </button>

          {/* Centered Title */}
          <button className="py-2 px-6 text-white font-medium relative">
            Sell
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></span>
          </button>
        </div>

        <div className="flex flex-col py-5">
          {/* Wallet connect + country & currency */}
          <div className="flex items-center justify-between px-4 py-3">
            <select className="bg-[#1a1a1a] text-gray-300 text-sm rounded-md px-3 py-2 w-40 border border-gray-700">
              <option>Select Wallet</option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.chain} - {wallet.address.slice(0, 6)}...
                </option>
              ))}
            </select>

            <div className="flex items-center">
              <button
                onClick={() => setShowFiatModal(true)}
                className="bg-[#1a1a1a] flex flex-row items-center gap-2 text-gray-300 text-sm px-3 py-2 rounded-md border border-gray-700"
              >
                {selectedCurrency
                  ? `${selectedCurrency.code}`
                  : "Select Currency"}{" "}
                <FaAngleDown />
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="text-center py-6 flex justify-center items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                let val = e.target.value;

                if (val.length > 1 && val.startsWith("0")) {
                  val = val.replace(/^0+/, "");
                }

                if (val.startsWith("-")) {
                  val = val.replace("-", "");
                }

                setAmount(val);
              }}
              className="text-4xl font-bold text-white bg-transparent border-none text-center focus:outline-none w-32 
               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
              min="0"
            />
            {selectedAsset && (
              <span className="text-2xl font-bold text-gray-300">
                {selectedAsset.symbol}
              </span>
            )}
          </div>

          {/* Asset selection */}
          <div className="px-4 py-3">
            <div
              onClick={() => setShowAssetModal(true)}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer"
            >
              {selectedAsset ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAsset.image}
                    alt={selectedAsset.name}
                    className="w-7 h-7"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {selectedAsset.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedAsset.mainnet}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Select Asset</p>
              )}
              <span className="text-gray-400">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="max-w-sm h-[80vh] w-full bg-[#111] border-gray-800 rounded-2xl shadow-lg flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-white text-lg font-semibold">Select Asset</h2>
              <button
                onClick={() => setShowAssetModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <h3 className="text-gray-400 text-sm px-4 mt-4 mb-2">
                Popular Mainnets
              </h3>
              {topMainnets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] hover:rounded-xl cursor-pointer"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowAssetModal(false);
                  }}
                >
                  <img src={asset.image} alt={asset.name} className="w-7 h-7" />
                  <div>
                    <p className="text-white">{asset.name}</p>
                    <p className="text-xs text-gray-400">{asset.mainnet}</p>
                  </div>
                </div>
              ))}

              <h3 className="text-gray-400 text-sm px-4 mt-6 mb-2">
                Your Assets
              </h3>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] cursor-pointer"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowAssetModal(false);
                    }}
                  >
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-7 h-7"
                    />
                    <div>
                      <p className="text-white">{asset.name}</p>
                      <p className="text-xs text-gray-400">{asset.mainnet}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm px-4">
                  No assets found in your wallets.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fiat Modal */}
      <FiatCurrencyModal
        show={showFiatModal}
        onClose={() => setShowFiatModal(false)}
        onSelect={(currency) => {
          setSelectedCurrency(currency);
          setShowFiatModal(false);
        }}
      />
    </main>
  );
}
