// src/redux/diceSlice.js
import { createSlice } from "@reduxjs/toolkit";
import calculateScore from "../utils/calculateScore";

const initialDice = Array.from({ length: 6 }, () => ({
  value: 1,
  sideIndex: 0,
  held: false,
}));

const initialState = {
  dice: initialDice,
  isRolling: false,
  gameStarted: false,
  activePlayer: null, // "player1" or "player2"
  player1Score: 0,
  player2Score: 0,
  turnTotal: 0,
  bank: 0, // score from held dice
  player1Name: "Player 1",
  player2Name: "Player 2",
  namesLocked: false,
  finalRound: false,
  smoked: false,
  currentRoll: [],
  currentRollScore: 0,
  currentRollScoringDice: [],
  winner: null,
  // Track initial qualifying roll
  player1Open: false,
  player2Open: false,
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    // ---- Start/stop roll for animation ----
    startRoll(state) {
      state.isRolling = true;
    },
    stopRoll(state) {
      state.isRolling = false;
    },

    // ---- Animated dice for Start button ----
    setAnimatedDice(state, action) {
      state.dice = action.payload;
    },

    // ---- Lock player names ----
    lockNames(state) {
      state.namesLocked = true;
    },

    // ---- Starting player roll ----
    startRollForStartingPlayer(state, action) {
      const { firstValue, lastValue } = action.payload;

      state.dice[0] = { value: firstValue, sideIndex: Math.floor(Math.random() * 4), held: false };
      state.dice[5] = { value: lastValue, sideIndex: Math.floor(Math.random() * 4), held: false };
      for (let i = 1; i <= 4; i++) state.dice[i] = { value: 1, sideIndex: 0, held: false };

      if (firstValue > lastValue) state.activePlayer = "player1";
      else if (lastValue > firstValue) state.activePlayer = "player2";
      else state.activePlayer = null;

      state.gameStarted = true;
      state.currentRoll = [firstValue, null, null, null, null, lastValue];
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
    },

    // ---- Regular roll during turn ----
    regularRoll(state) {
      if (!state.gameStarted || state.winner) return;

      // Roll unheld dice
      state.dice = state.dice.map(d => ({
        ...d,
        value: d.held ? d.value : Math.floor(Math.random() * 6) + 1,
        sideIndex: d.held ? d.sideIndex : Math.floor(Math.random() * 4),
      }));

      // Only unheld dice are scored for this roll
      const currentRollValues = state.dice
        .map(d => (!d.held ? d.value : null))
        .filter(v => v !== null);

      const { score, scoringDice } = calculateScore(currentRollValues);

      state.currentRoll = state.dice.map(d => d.value);
      state.currentRollScore = score;

      // Map scoring dice to real dice indices
      let scoringIndices = [];
      let unheldIndex = 0;
      for (let i = 0; i < state.dice.length; i++) {
        if (!state.dice[i].held) {
          if (scoringDice.includes(unheldIndex)) scoringIndices.push(i);
          unheldIndex++;
        }
      }
      state.currentRollScoringDice = scoringIndices;

      if (score === 0) {
        // Player smoked
        state.smoked = true;
        state.turnTotal = 0;
        state.bank = 0;
        // Turn will be switched by UI after delay
      } else {
        state.smoked = false;

        // Bank = sum of held dice only
        const heldValues = state.dice.filter(d => d.held).map(d => d.value);
        const heldScore = heldValues.length > 0 ? calculateScore(heldValues).score : 0;

        state.bank = heldScore;
        state.turnTotal = heldScore + score;
      }
    },

    // ---- Toggle hold on scoring dice ----
    toggleHold(state, action) {
      const idx = action.payload;
      const die = state.dice[idx];

      // Only scoring dice in current roll can be held
      if (!state.currentRollScoringDice.includes(idx)) return;

      die.held = !die.held;

      // Recalculate bank (held dice only)
      const heldValues = state.dice.filter(d => d.held).map(d => d.value);
      const { score: heldScore } = calculateScore(heldValues);
      state.bank = heldScore;

      // Update turn total: bank + unheld scoring dice
      const unheldValues = state.dice.filter(d => !d.held).map(d => d.value);
      const { score: currentScore } = calculateScore(unheldValues);
      state.turnTotal = heldScore + currentScore;
    },

    // ---- Bank points and end turn ----
    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.turnTotal;

      // First turn must score >= 1000 to open
      if (!state[`${current}Open`]) {
        if (points >= 1000) {
          state[`${current}Open`] = true;
        } else {
          // Smoked/fail to open → lose turn
          state.turnTotal = 0;
          state.bank = 0;
          state.smoked = true;
          state.activePlayer = current === "player1" ? "player2" : "player1";
          return;
        }
      }

      // Add points to score
      if (current === "player1") state.player1Score += points;
      else state.player2Score += points;

      const p1 = state.player1Score;
      const p2 = state.player2Score;

      // Trigger final round if someone reaches 10,000
      if (!state.finalRound && (p1 >= 10000 || p2 >= 10000)) {
        state.finalRound = true;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        state.turnTotal = 0;
        state.bank = 0;
        return;
      }

      // Final round logic
      if (state.finalRound && current === "player2") {
        if (p1 > p2) state.winner = state.player1Name;
        else if (p2 > p1) state.winner = state.player2Name;
        else state.winner = "It's a tie!";
        state.gameStarted = false;
        return;
      }

      // Prepare next turn
      state.turnTotal = 0;
      state.bank = 0;
      state.dice = initialDice.map(d => ({ ...d, held: false }));
      state.activePlayer = current === "player1" ? "player2" : "player1";
      state.smoked = false;
    },

    // ---- Dismiss smoked overlay ----
    dismissSmokedOverlay(state) {
      state.smoked = false;
    },

    setPlayerName(state, action) {
      const { player, name } = action.payload;
      if (player === "player1") state.player1Name = name;
      else if (player === "player2") state.player2Name = name;
    },

    resetGame() {
      return { ...initialState };
    },
  },
});

export const {
  startRoll,
  stopRoll,
  setAnimatedDice,
  lockNames,
  startRollForStartingPlayer,
  regularRoll,
  toggleHold,
  bankPointsAndEndTurn,
  dismissSmokedOverlay,
  setPlayerName,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;
