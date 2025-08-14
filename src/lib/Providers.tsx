"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store"; // ✅ using alias path

function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
export default Providers;