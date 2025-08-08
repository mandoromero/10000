import { createSlice } from "@reduxjs/toolkit";
import calculateScore from "../calculateScore.js";

const initialState = {
  dice: Array(6).fill().map(() => ({ value: 1, sideIndex: 0, held: false })),
  gameStarted: false,
  startingPlayer: null,
  bankPoints: 0,
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    setDice(state, action) {
      state.dice = action.payload;
      // No score calculation here — score depends on held dice
    },
    rollDice(state) {
      // Roll only dice that are NOT held
      state.dice = state.dice.map((die) =>
        die.held
          ? die
          : {
              value: Math.floor(Math.random() * 6) + 1,
              sideIndex: Math.floor(Math.random() * 4),
              held: false,
            }
      );
    },
    toggleHold(state, action) {
      const idx = action.payload;
      state.dice[idx].held = !state.dice[idx].held;

      // Calculate score ONLY from held dice after toggling
      const heldDice = state.dice.filter((d) => d.held);
      state.bankPoints = calculateScore(heldDice);
    },
    resetBankPoints(state) {
      state.bankPoints = 0;
    },
    startRoll(state) {
      // Your existing startRoll logic here...
    },
  },
});

export const { setDice, rollDice, toggleHold, resetBankPoints, startRoll } = diceSlice.actions;
export default diceSlice.reducer;
