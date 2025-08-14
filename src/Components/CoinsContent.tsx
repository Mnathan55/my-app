"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy } from "lucide-react";
import Image from "next/image";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  receiveAddress: string;
}

const coinsData: Coin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "/coins/bitcoin.png",
    receiveAddress: "141LxgUA8TWQDbRPGqCx26pCJKuR7yg3pj",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "/coins/ethereum.png",
    receiveAddress: "0x94e2233871d9e2c86cdf3330435230a57fe3770b",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    image: "/coins/dogecoin.png",
    receiveAddress: "DJxkCjHpgj7c2bTgB5WELiaTDKuKxHUHVz",
  },
  {
    id: "tron",
    name: "TRX Tron",
    symbol: "TRX",
    image: "/coins/tron.png",
    receiveAddress: "TQwJZfe7vjLq36mBS2JrURPz8UfTiciFGk",
  },
  {
    id: "tether",
    name: "USDT",
    symbol: "USDT",
    image: "/coins/usdt.png",
    receiveAddress: "0x94e2233871d9e2c86cdf3330435230a57fe3770b",
  },
];

export default function CoinsContent() {
  const router = useRouter();
  const [openWalletId, setOpenWalletId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-[#111] text-white flex flex-col min-h-screen w-full max-w-4xl mx-auto p-2 rounded-lg shadow-lg">
      <div className="space-y-4">
        {coinsData.map((coin) => (
          <div
            key={coin.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-[#1c1c1e] border border-gray-700 rounded-xl shadow-lg hover:bg-[#242426] transition"
          >
            {/* Left - Coin Info */}
            <div
              className="flex items-center w-full h-full cursor-pointer"
              onClick={() => router.push(`/dashboard/coin/${coin.id}`)}
            >
{/*               <Image
                src={coin.image}
                alt={coin.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-4"
              /> */}
              <div>
                <div className="text-lg font-bold text-white">{coin.name}</div>
                <div className="text-sm text-gray-400">{coin.symbol}</div>
              </div>
            </div>

            {/* Right - Address & QR Button */}
            <div className="mt-3 md:mt-0 text-sm text-gray-300 break-all flex items-center gap-2">
              <button
                onClick={() => setOpenWalletId(coin.id)}
                className="ml-2 w-[100px] px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Show QR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen QR Modal */}
      {openWalletId && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-500/50 z-40"
            onClick={() => setOpenWalletId(null)}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#171717] rounded-2xl shadow-2xl w-full max-w-sm py-20 flex flex-col items-center relative">
              {/* Header */}
              <h3 className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xl font-bold text-white">
                Receive
              </h3>
              <button
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setOpenWalletId(null)}
              >
                <X size={20} />
              </button>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <QRCodeSVG
                  value={
                    coinsData.find((c) => c.id === openWalletId)?.receiveAddress ||
                    ""
                  }
                  size={180}
                />
              </div>

              {/* Address */}
              <p
                className="mt-4 text-lg text-center text-gray-300 px-4 select-all break-words max-w-full overflow-x-auto whitespace-pre-wrap"
                style={{ wordBreak: "break-word" }}
              >
                {coinsData.find((c) => c.id === openWalletId)?.receiveAddress ||
                  "No address found"}
              </p>

              {/* Copy Button */}
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                onClick={() =>
                  copyToClipboard(
                    coinsData.find((c) => c.id === openWalletId)?.receiveAddress ||
                      ""
                  )
                }
              >
                <Copy size={16} />
                <span>Copy address</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
