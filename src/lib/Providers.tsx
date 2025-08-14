// src/lib/Providers.tsx
"use client";

import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import store from "../store/store";

type ProvidersProps = {
  children: ReactNode;
  session?: Session; // Replace `any` with `Session` from "next-auth" if you want strict typing
};

function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </SessionProvider>
  );
}
export default Providers;