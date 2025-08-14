import TabbedSection from "@/Components/TabbedSection";
import WalletBalance from "../../Components/WalletBalance";
import WalletHeader from "../../Components/WalletHeader";


export default function DashboardPage() {
  return (
    <main className="max-w-3xl w-full mx-auto flex flex-col items-center">
      <WalletHeader />
      <WalletBalance />
      <TabbedSection />
    </main>
  );
}
