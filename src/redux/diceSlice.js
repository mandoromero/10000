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
  activePlayer: "player1",
  player1Score: 0,
  player2Score: 0,
  turnTotal: 0,
  player1Open: false,
  player2Open: false,
  winner: null,
  player1Name: "Player 1",
  player2Name: "Player 2",
  finalRound: false,
  smoked: false,
  currentRoll: [],
  currentRollScore: 0,
  finalRoundFirstPlayer: null,
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    startRoll(state) {
      state.isRolling = true;
    },

    stopRoll(state) {
      state.isRolling = false;
    },

    setDice(state, action) {
      state.dice = action.payload;
    },

    setStartingPlayer(state, action) {
      state.activePlayer = action.payload;
    },

    initialRollForStartingPlayer(state) {
      if (state.gameStarted) return;

      const newDice = [...state.dice];

      // Roll die 0
      newDice[0] = {
        ...newDice[0],
        value: Math.floor(Math.random() * 6) + 1,
        sideIndex: Math.floor(Math.random() * 4),
      };

      // Roll die 5
      newDice[5] = {
        ...newDice[5],
        value: Math.floor(Math.random() * 6) + 1,
        sideIndex: Math.floor(Math.random() * 4),
      };

      state.dice = newDice;

      const p1 = newDice[0].value;
      const p2 = newDice[5].value;

      if (p1 > p2) {
        state.activePlayer = "player1";
        state.gameStarted = true;
      } else if (p2 > p1) {
        state.activePlayer = "player2";
        state.gameStarted = true;
      } else {
        state.activePlayer = null; // tie
      }

      state.currentRoll = [p1, ...Array(4).fill(null), p2];
      state.currentRollScore = 0;
    },

    regularRoll(state) {
      if (!state.gameStarted || state.winner) return;

      const allHeld = state.dice.every((d) => d.held);
      if (allHeld) {
        state.dice = state.dice.map((d) => ({ ...d, held: false }));
      }

      state.dice = state.dice.map((d) =>
        d.held
          ? d
          : {
              ...d,
              value: Math.floor(Math.random() * 6) + 1,
              sideIndex: Math.floor(Math.random() * 4),
            }
      );

      state.currentRoll = state.dice.map((d) => d.value);

      const { score, scoringDice } = calculateScore(state.currentRoll);
      state.currentRollScore = score;

      if (score === 0) {
        state.smoked = true;
        state.turnTotal = 0;
      } else {
        state.smoked = false;
        // Optionally auto-add points from held scoring dice
        const heldIndexes = state.dice
          .map((d, idx) => (d.held ? idx : -1))
          .filter((i) => i !== -1);

        if (heldIndexes.length > 0) {
          const heldScore = scoringDice
            .filter((idx) => heldIndexes.includes(idx))
            .length
            ? score
            : 0;
          state.turnTotal += heldScore;
        }
      }
    },

    toggleHold(state, action) {
      const idx = action.payload;
      if (idx < 0 || idx >= state.dice.length) return;
      state.dice[idx].held = !state.dice[idx].held;
    },

    addScore(state, action) {
      state.turnTotal += action.payload;
    },

    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.turnTotal;

      if (points === 0) {
        state.smoked = true;
        state.turnTotal = 0;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        return;
      }

      if (current === "player1") state.player1Score += points;
      else state.player2Score += points;

      const p1 = state.player1Score;
      const p2 = state.player2Score;

      if (!state.finalRound && (p1 >= 10000 || p2 >= 10000)) {
        state.finalRound = true;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        state.turnTotal = 0;
        return;
      }

      if (state.finalRound && current === "player2") {
        if (p1 > p2) state.winner = state.player1Name;
        else if (p2 > p1) state.winner = state.player2Name;
        else state.winner = "It's a tie!";
        state.gameStarted = false;
        return;
      }

      state.turnTotal = 0;
      state.activePlayer = current === "player1" ? "player2" : "player1";
    },

    nextTurn(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      state.turnTotal = 0;
      state.dice = initialDice.map((d) => ({ ...d, held: false }));
      state.isRolling = false;
    },

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
  initialRollForStartingPlayer,
  regularRoll,
  setDice,
  setStartingPlayer,
  toggleHold,
  addScore,
  nextTurn,
  bankPointsAndEndTurn,
  dismissSmokedOverlay,
  setPlayerName,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;
