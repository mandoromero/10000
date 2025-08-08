// diceSlice.js
import { createSerializableStateInvariantMiddleware, createSlice } from "@reduxjs/toolkit";

const initialState = {
  dice: Array(6).fill().map(() => ({
    value: 1,
    sideIndex: 0,
    held: false,
  })),
  gameStarted: false,
  startingPlayer: null,
  startRolling: false,
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
    startRoll: (state) => {
      const rollDie = () => Math.floor(Math.random()* 6) + 1;
      const rollSide = () => Math.floor(Math.random() * 4);

      const firstValue = rollDie();
      const lastValue = rollDie();

      state.dice[0] = {value: firstValue, sideIndex: rollSide(),held: false};
      state.dice[state.dice.length - 1]= { value: lastValue, sideIndex: rollSide(), held: false};

      if (firstValue > lastValue) {
        state.startingPlayer = "player1";
        state.gameStarted = true;
        state.startRolling = false;
      } else if (lastValue > firstValue) {
        state.startingPlayer = "player2";
        state.gameStarted = true;
        state.startRolling = false;
      } else {
        state.startingPlayer = null;
        state.startRolling = false;
      }
    },
  },
});

export const { rollDice, toggleHold, startRoll } = diceSlice.actions;
export default diceSlice.reducer;
