import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice"

const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
