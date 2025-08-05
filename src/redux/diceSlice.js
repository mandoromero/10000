// diceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dice: Array(6).fill().map(() => ({
    value: 1,
    sideIndex: 0,
    held: false,
  })),
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    rollDice: (state) => {
      state.dice = state.dice.map(die =>
        die.held
          ? die
          : {
              value: Math.floor(Math.random() * 6) + 1, // 1–6
              sideIndex: Math.floor(Math.random() * 4), // 0–3 variation
              held: false,
            }
      );
    },
    toggleHold: (state, action) => {
      const idx = action.payload;
      state.dice[idx].held = !state.dice[idx].held;
    },
  },
});

export const { rollDice, toggleHold } = diceSlice.actions;
export default diceSlice.reducer;
