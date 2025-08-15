import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice"
import totalBalanceReducer from "./totalBalanceSlice";

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    totalBalance: totalBalanceReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
