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
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    setDice(state, action) {
      state.dice = action.payload;
    },
    rollDice(state) {
      const freshDice = [];
      state.dice = state.dice.map((die) => {
        if (die.held) return die;
        const newDie = {
          value: Math.floor(Math.random() * 6) + 1,
          sideIndex: Math.floor(Math.random() * 4),
          held: false,
        };
        freshDice.push(newDie.value);
        return newDie;
      });
    
      state.currentRoll = freshDice; // track this roll
      const rollScore = calculateScore(freshDice);
      state.currentRollScore = rollScore;

      if (rollScore === 0) {
        // Player smoked — end the turn
        state.smoked = true;
      }
    },
    toggleHold(state, action) {
      if (!state.gameStarted) return;

      const idx = action.payload;
      state.dice[idx].held = !state.dice[idx].held;
      const die = state.dice[idx];

      // Only toggle if it's part of the current roll
      if (state.currentRoll.includes(die.value)) {
        die.held = !die.held;

        // Get all dice being held from THIS roll
        const newlyHeld = state.dice
          .filter((d, i) => d.held && state.currentRoll.includes(d.value))
          .map(d => d.value);

        // Score only the newly held dice from this roll
        state.bankPoints += calculateScore(newlyHeld);

        // Remove scored dice from currentRoll to prevent double-scoring
        state.currentRoll = state.currentRoll.filter(val => !newlyHeld.includes(val));
      }
    },
    updateBankFromHeld(state) {
      const heldValues = state.dice.filter(d => d.held).map(d => d.value);
      state.vankPoints = calculateScore(heldValues)
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
        sideIndex: 0
      }));
    },
    endTurn(state) {
      state.bankPoints = 0;
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.dice = state.dice.map(d => ({ ...d, held: false }));
      state.smoked = false;
    },
    dismissSmokedOverlay(state) {
      state.bankPoints = 0;
      state.currentRollScore = 0;
      state.dice = state.dice.map;(d => ({ ...d, held: false }));
      state.smoked = false;
      state.currentRoll = [];
    },
  }
});

export const { 
  setDice, 
  rollDice, 
  toggleHold, 
  resetBankPoints, 
  setStartingPlayer, 
  startRoll,
  endTurn,
  dismissSmokedOverlay,
} = diceSlice.actions;

export default diceSlice.reducer;
