// src/lib/Providers.tsx
"use client";

import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

type ProvidersProps = {
  children: ReactNode;
  session?: Session; // Replace `any` with `Session` from "next-auth" if you want strict typing
};

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </SessionProvider>
  );
}
