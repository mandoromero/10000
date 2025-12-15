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
  activePlayer: null,
  player1Score: 0,
  player2Score: 0,
  turnTotal: 0,
  bank: 0,
  player1Name: "Player 1",
  player2Name: "Player 2",
  namesLocked: false,
  finalRound: false,
  smoked: false,
  currentRoll: [],
  currentRollScore: 0,
  currentRollScoringDice: [],
  winner: null,
  player1Open: false,
  player2Open: false,
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    // ---- Rolling flags ----
    startRoll(state) {
      state.isRolling = true;
    },

    stopRoll(state) {
      state.isRolling = false;
    },

    // ---- Animated dice ----
    setAnimatedDice(state, action) {
      state.dice = action.payload;
    },

    // ---- Lock player names ----
    lockNames(state) {
      state.namesLocked = true;
      state.isRolling = false;
    },

    // ---- Starting player roll ----
    startRollForStartingPlayer(state, action) {
      const { firstValue, lastValue } = action.payload;

      state.isRolling = false;

      state.dice = initialDice.map(d => ({ ...d, held: false }));
      state.dice[0].value = firstValue;
      state.dice[5].value = lastValue;

      if (firstValue > lastValue) state.activePlayer = "player1";
      else if (lastValue > firstValue) state.activePlayer = "player2";

      state.gameStarted = true;
      state.currentRoll = [];
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.bank = 0;
      state.turnTotal = 0;
    },

    regularRoll(state) {
      if (!state.gameStarted || state.winner) return;

      if (state.dice.every(d => d.held)) {
        state.dice.forEach(d => (d.held = false));
      }

      state.dice.forEach(d => {
        if (!d.held) {
          d.value = Math.floor(Math.random() * 6) + 1;
          d.sideIndex = Math.floor(Math.random() * 4);
        }
      });

      const rollValues = state.dice.filter(d => !d.held).map(d => d.value);
      const { score, scoringDice } = calculateScore(rollValues);

      state.currentRoll = state.dice.map(d => d.value);
      state.currentRollScore = score;


      let map = [];
      let unheldIdx = 0;
      state.dice.forEach((d, i) => {
        if (!d.held) {
          if (scoringDice.includes(unheldIdx)) map.push(i);
          unheldIdx++;
        }
      });
      state.currentRollScoringDice = map;

      if (score === 0) {
        state.smoked = true;
        state.turnTotal = 0;
        state.currentRollScore = 0;
      } else {
        state.smoked = false;
        state.turnTotal = state.bank + score;
      }
    },

    toggleHold(state, action) {
      const idx = action.payload;

      if (!state.currentRollScoringDice.includes(idx)) return;

      state.dice[idx].held = !state.dice[idx].held;

      const heldValues = state.dice
        .filter(d => d.held)
        .map(d => d.value);
      const { score: heldScore } = calculateScore(heldValues);
      state.bank = heldScore;

      const unheldValues = state.dice
        .filter(d => !d.held)
        .map(d => d.value);
      const { score: currentScore, scoringDice: newScoring } = calculateScore(unheldValues);

      let map = [];
      let unheldIdx = 0;
      state.dice.forEach((d, i) => {
        if (!d.held) {
          if (newScoring.includes(unheldIdx)) map.push(i);
          unheldIdx++;
        }
      });

      state.currentRollScore = currentScore;
      state.currentRollScoringDice = map;

      state.turnTotal = state.bank + state.currentRollScore;  
    },

    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.turnTotal;

      state.isRolling = false;

      if (!state[`${current}Open`]) {
        if (points >= 1000) {
          state[`${current}Open`] = true;
        } else {
          state.turnTotal = 0;
          state.bank = 0;
          state.smoked = true;
          state.activePlayer = current === "player1" ? "player2" : "player1";
          return;
        }
      }

      if (current === "player1") state.player1Score += points;
      else state.player2Score += points;

      if (!state.finalRound && (state.player1Score >= 10000 || state.player2Score >= 10000)) {
        state.finalRound = true;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        state.turnTotal = 0;
        state.bank = 0;
        return;
      }

      if (state.finalRound && current === "player2") {
        state.winner =
          state.player1Score > state.player2Score
            ? state.player1Name
            : state.player2Score > state.player1Score
            ? state.player2Name
            : "It's a tie!";
        state.gameStarted = false;
        return;
      }

      // Reset for next player
      state.turnTotal = 0;
      state.bank = 0;
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.dice = initialDice.map(d => ({ ...d, held: false }));
      state.activePlayer = current === "player1" ? "player2" : "player1";
      state.smoked = false;
    },

    dismissSmokedOverlay(state) {
    state.smoked = false;
    },

    setPlayerName(state, action) {
      const { player, name } = action.payload;
      if (player === "player1") state.player1Name = name;
      if (player === "player2") state.player2Name = name;
    },

    // ---- RESET GAME ----
    resetGame() {
      return {
        ...initialState,
        isRolling: false,
      };
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
