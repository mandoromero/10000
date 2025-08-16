// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import diceReducer from "./diceSlice";

export const store = configureStore({
  reducer: {
    dice: diceReducer,
  },
});

// Infer the `RootState` type from the store itself
// export type RootState = ReturnType<typeof store.getState>;

// Optional: export AppDispatch type for use with dispatch if needed
// export type AppDispatch = typeof store.dispatch;
