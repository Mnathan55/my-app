"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

// Fiat currency list
const fiatCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
];

interface FiatCurrencyModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (currency: { code: string; name: string; symbol: string; flag: string }) => void;
}

export default function FiatCurrencyModal({ show, onClose, onSelect }: FiatCurrencyModalProps) {
  // close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* Modal Card */}
      <div className="h-screen w-full md:max-w-sm md:h-[80vh] bg-[#111] border-gray-800rounded-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">Select Fiat Currency</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {fiatCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                onSelect(currency);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-800 transition"
            >
              <span className="text-2xl text-gray-400">{currency.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-white font-medium">{currency.name}</p>
                <p className="text-gray-400 text-sm">{currency.code}</p>
              </div>
              <span className="text-white">{currency.symbol}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
