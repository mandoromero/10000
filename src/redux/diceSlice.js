import { createSlice } from "@reduxjs/toolkit";

const initialDice = Array.from({ length: 6 }, () => ({
  value: 1,
  sideIndex: 0,
  held: false,
}));

const initialState = {
  dice: initialDice,
  firstPlayer: "player1", // or "player2"
  rollTrigger: false,
  gameStarted: false,
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    setDieValue: (state, action) => {
      const { index, value, sideIndex } = action.payload;
      if (state.dice[index]) {
        state.dice[index].value = value;
        state.dice[index].sideIndex = sideIndex;
      }
    },
    toggleHold: (state, action) => {
      const index = action.payload;
      if (state.dice[index]) {
        state.dice[index].held = !state.dice[index].held;
      }
    },
    resetDice: (state) => {
      state.dice = initialDice.map(() => ({
        value: 1,
        sideIndex: 0,
        held: false,
      }));
    },
    holdAllDice: (state) => {
      state.dice.forEach((die) => {
        die.held = true;
      });
    },
    unholdAllDice: (state) => {
      state.dice.forEach((die) => {
        die.held = false;
      });
    },
    switchPlayer: (state) => {
      state.firstPlayer = state.firstPlayer === "player1" ? "player2" : "player1";
    },

    // ✅ Added reducers below
    triggerRoll: (state) => {
      state.rollTrigger = true;
    },
    resetRollTrigger: (state) => {
      state.rollTrigger = false;
    },
    setGameStarted: (state, action) => {
      state.gameStarted = action.payload;
    },
  },
});

export const {
  setDieValue,
  toggleHold,
  resetDice,
  holdAllDice,
  unholdAllDice,
  switchPlayer,
  triggerRoll,
  resetRollTrigger,
  setGameStarted,
} = diceSlice.actions;

export default diceSlice.reducer;
