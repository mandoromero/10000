import { createSlice } from "@reduxjs/toolkit";
import calculateScore from "../calculateScore.js";

const initialState = {
  dice: Array(6).fill().map(() => ({ value: 1, sideIndex: 0, held: false })),
  gameStarted: false,
  startingPlayer: null,
  bankPoints: 0,
  currentRollScore: 0,
  currentRoll: [],
  smoked: false,

  player1Score: 0,
  player2Score: 0,
  activePlayer: "player1",
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    setDice(state, action) {
      state.dice = action.payload;
    },

    rollDice(state) {
      const allHeld = state.dice.every(die => die.held); // 🔑 Hot Dice check
      const freshDice = [];

      state.dice = state.dice.map((die) => {
        if (allHeld || !die.held) {
          const newDie = {
            value: Math.floor(Math.random() * 6) + 1,
            sideIndex: Math.floor(Math.random() * 4),
            held: false, // reset hold if Hot Dice
          };
          freshDice.push(newDie.value);
          return newDie;
        }
        return die;
      });

      state.currentRoll = freshDice;
      const rollScore = calculateScore(freshDice);
      state.currentRollScore = rollScore;

      if (rollScore === 0) {
        state.smoked = true; // turn ends if no score
      }
    },

    toggleHold(state, action) {
      if (!state.gameStarted) return;

      const idx = action.payload;
      const die = state.dice[idx];
      if (!die) return;

      die.held = !die.held;

      // ✅ Recalculate score of *all held dice*
      const heldValues = state.dice.filter(d => d.held).map(d => d.value);
      state.bankPoints = calculateScore(heldValues);
    },

    bankPointsAndEndTurn(state) {
      if (state.bankPoints === 0) return;

      if (state.activePlayer === "player1") {
        state.player1Score += state.bankPoints;
        state.activePlayer = "player2";
      } else {
        state.player2Score += state.bankPoints;
        state.activePlayer = "player1";
      }

      // reset state for next turn
      state.bankPoints = 0;
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.dice = state.dice.map((d) => ({ ...d, held: false }));
      state.smoked = false;
    },

    resetBankPoints(state) {
      state.bankPoints = 0;
    },

    setStartingPlayer(state, action) {
      state.startingPlayer = action.payload;
    },

    startRoll(state) {
      state.gameStarted = true;
      state.startingPlayer = null;
      state.bankPoints = 0;
      state.currentRoll = [];
      state.smoked = false;
      state.dice = state.dice.map(die => ({
        ...die,
        held: false,
        value: 1,
        sideIndex: 0,
      }));
    },

    endTurn(state) {
      // ✅ fixed ternary operator
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";

      state.bankPoints = 0; 
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.dice = state.dice.map((d) => ({ ...d, held: false }));
      state.smoked = false;
    },

    dismissSmokedOverlay(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";

      state.bankPoints = 0;
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.dice = state.dice.map(d => ({ ...d, held: false }));
      state.smoked = false;
    },
  },
});

export const { 
  setDice, 
  rollDice, 
  toggleHold, 
  resetBankPoints, 
  setStartingPlayer, 
  startRoll,
  bankPointsAndEndTurn,
  endTurn,
  dismissSmokedOverlay,
} = diceSlice.actions;

export default diceSlice.reducer;
