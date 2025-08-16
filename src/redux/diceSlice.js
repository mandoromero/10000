import { createSlice } from "@reduxjs/toolkit";
import calculateScore  from "../calculateScore.js";

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
      if(state.gameStarted == true) {
        const idx = action.payload;
        state.dice[idx].held = !state.dice[idx].held;
        const heldDiceValues = state.dice
        .filter((d) => d.held)
        .map((d) => d.value);
        state.bankPoints = calculateScore(heldDiceValues);
      }
    },
    resetBankPoints(state) {
      state.bankPoints = 0;
    },
    setStartingPlayer (state, action) {
      state.startingPlayer = action.payload;   
    },
    startRoll(state) {
      state.gameStarted = true;
      state.startingPlayer = null; // Reset starting player for new game
      state.bankPoints = 0; // Reset bank points at the start of a new roll
      state.dice = state.dice.map(die => ({ ...die, held: false, value: 1, sideIndex: 0}));
    },
  }
});

export const { 
  setDice, 
  rollDice, 
  toggleHold, 
  resetBankPoints, 
  setStartingPlayer, 
  startRoll 
} = diceSlice.actions;
export default diceSlice.reducer;
