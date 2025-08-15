import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TotalBalanceState {
  value: number; // in USD
}

const initialState: TotalBalanceState = {
  value: 0,
};

const totalBalanceSlice = createSlice({
  name: "totalBalance",
  initialState,
  reducers: {
    setTotalBalance(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
    resetTotalBalance(state) {
      state.value = 0;
    },
  },
});

export const { setTotalBalance, resetTotalBalance } = totalBalanceSlice.actions;
export default totalBalanceSlice.reducer;
