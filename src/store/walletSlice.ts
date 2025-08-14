import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Wallet type according to your Prisma schema
export interface Wallet {
  id: string;
  chain: string;
  address: string;
  balance: string; // using string because Decimal is returned as string in JSON
  createdAt: string;
  updatedAt: string;
  userId: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: string;
  amount: string; // Decimal → string
  createdAt: string;
  updatedAt: string;
  walletId: string;
}

interface WalletState {
  list: Wallet[];
}

const initialState: WalletState = {
  list: [],
};

const walletSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<Wallet[]>) {
      state.list = action.payload;
    },
    addWallet(state, action: PayloadAction<Wallet>) {
      state.list.push(action.payload);
    },
    updateWallet(state, action: PayloadAction<Wallet>) {
      const index = state.list.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeWallet(state, action: PayloadAction<string>) {
      state.list = state.list.filter((wallet) => wallet.id !== action.payload);
    },
    addTransaction(
      state,
      action: PayloadAction<{ walletId: string; transaction: Transaction }>
    ) {
      const wallet = state.list.find((w) => w.id === action.payload.walletId);
      if (wallet) {
        wallet.transactions.push(action.payload.transaction);
      }
    },
  },
});

export const { setWallets, addWallet, updateWallet, removeWallet, addTransaction } =
  walletSlice.actions;

export default walletSlice.reducer;
