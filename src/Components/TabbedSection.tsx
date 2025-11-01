"use client";
import React, { useState } from "react";
import WalletList from "./WalletList";
import CoinsContent from "./CoinsContent";
import KYCForm from "./KYCForm";
import { Wallet } from "next-auth";
import { Wallet as WalletIcon, DollarSign, FileText } from "lucide-react";


interface WalletListProps {
  wallets: Wallet[];
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
}


const TabbedSection: React.FC<WalletListProps> = ({ wallets, setWallets }) => {
  const [activeTab, setActiveTab] = useState("wallet");

  return (
    <div className="bg-[#111] text-white flex flex-col min-h-screen w-full max-w-4xl mx-auto p-2">
      {/* Tabs */}
      <nav
        className="flex border-b border-gray-700"
        role="tablist"
        aria-label="Wallet tabs"
      >
        {[
          { id: "wallet", label: "Wallets", Icon: WalletIcon },
          { id: "coins", label: "Coins", Icon: DollarSign },
          { id: "kyc", label: "KYC", Icon: FileText },
        ].map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${id}-tab`}
              id={`${id}-tab-btn`}
              onClick={() => setActiveTab(id as "coins" | "wallet" | "kyc")}
              className={`flex items-center justify-center gap-2 flex-1 p-4 font-semibold text-sm transition-colors duration-200
                ${
                  isActive
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "border-b-2 border-transparent hover:bg-gray-700 text-gray-400 hover:text-white"
                }`}
            >
              <Icon size={20} />
              {label}
            </button>
          );
        })}
      </nav>
      
      <section className="py-6 px-2">
        {activeTab === "wallet" ? (
          <WalletList wallets={wallets} setWallets={setWallets} />
        ) : activeTab === "coins" ? (
          <CoinsContent />
        ) : (
          <KYCForm />
        )}
      </section>
    </div>
  );
};
export default TabbedSection;
