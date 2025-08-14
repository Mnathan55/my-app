import CoinsContent from "@/Components/CoinsContent";
import WalletBalance from "@/Components/WalletBalance";
import WalletHeader from "@/Components/WalletHeader";


export default function DashboardPage() {
  return (
    <main className="max-w-3xl w-full mx-auto flex flex-col items-center">
      <WalletHeader />
      <WalletBalance />
      <CoinsContent />
    </main>
  );
}
