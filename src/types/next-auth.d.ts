import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  // types/next-aut.d.ts

import { Decimal } from "@prisma/client/runtime";
import { Session } from "next-auth";

// Prisma Models

export type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  wallets?: Wallet[];
  accounts?: Account[];
  sessions?: Session[];
};

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;

  user: User;
};

export type Wallet = {
  id: string;
  chain: string;
  address: string;
  balance: Decimal;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  user?: User;
  transactions: Transaction[];
};

export type Transaction = {
  id: string;
  type: string;
  amount: Decimal;
  createdAt: Date;
  updatedAt: Date;

  walletId: string;
  wallet?: Wallet;
};

}