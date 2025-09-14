import { createSlice } from "@reduxjs/toolkit";
import calculateScore from "../calculateScore.js";

const makeDie = () => ({
  value: 1,
  sideIndex: 0,
  held: false,
  locked: false,
  rollId: null,
});

const initialState = {
  dice: Array(6).fill(null).map(makeDie),
  gameStarted: false,
  startingPlayer: null,
  bankLocked: 0,
  bankPoints: 0,
  currentRollScore: 0,
  currentRoll: [],
  smoked: false,
  player1Score: 0,
  player2Score: 0,
  activePlayer: "player1",
  player1Name: "Player 1",
  player2Name: "Player 2",
  currentRollId: null,
  winner: null,
  finalRound: false,
  targetScore: null,
};

// helper to clear roll/turn state
const resetTurnState = (state) => {
  state.bankLocked = 0;
  state.bankPoints = 0;
  state.currentRollScore = 0;
  state.currentRoll = [];
  state.currentRollId = null;
  state.smoked = false;
  state.dice = state.dice.map(makeDie);
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {
    setPlayerName(state, action) {
      const { player, name } = action.payload;
      if (player === "player1") state.player1Name = name || "Player 1";
      if (player === "player2") state.player2Name = name || "Player 2";
    },

    setStartingPlayer(state, action) {
      state.startingPlayer = action.payload;
    },

    setDice(state, action) {
      state.dice = action.payload;
    },

    rollDice(state) {
      if (!state.gameStarted) return;

      if (state.currentRollId !== null) {
        const heldNow = state.dice
          .filter(d => d.held && !d.locked && d.rollId === state.currentRollId)
          .map(d => d.value);

        const heldNowScore = calculateScore(heldNow);
        if (heldNowScore === 0) {
          state.smoked = true;
          return;
        }

        state.bankLocked += heldNowScore;
        state.dice = state.dice.map(d =>
          d.held && !d.locked && d.rollId === state.currentRollId
            ? { ...d, held: false, locked: true }
            : d
        );
        state.bankPoints = state.bankLocked;
      }

      const allLocked = state.dice.every(d => d.locked);
      if (allLocked) {
        state.dice = state.dice.map(d => ({ ...d, held: false, locked: false, rollId: null }));
      }

      state.currentRollId = (state.currentRollId ?? -1) + 1;

      const freshDice = [];
      state.dice = state.dice.map(d => {
        if (d.locked) return d;
        const newDie = {
          value: Math.floor(Math.random() * 6) + 1,
          sideIndex: Math.floor(Math.random() * 4),
          held: false,
          locked: false,
          rollId: state.currentRollId,
        };
        freshDice.push(newDie.value);
        return newDie;
      });

      state.currentRoll = freshDice;
      state.currentRollScore = calculateScore(freshDice);
      state.bankPoints = state.bankLocked;

      if (state.currentRollScore === 0) state.smoked = true;
    },

    toggleHold(state, action) {
      if (!state.gameStarted) return;

      const idx = action.payload;
      const die = state.dice[idx];
      if (!die || die.locked) return;

      die.held = !die.held;

      const heldDiceValues = state.dice
        .filter(d => d.held && !d.locked && d.rollId === state.currentRollId)
        .map(d => d.value);

      state.bankPoints = state.bankLocked + calculateScore(heldDiceValues);
    },

    endTurn(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      resetTurnState(state);
    },

    bankPointsAndEndTurn(state) {
      const heldCurrent = state.dice
        .filter(d => d.held && !d.locked && d.rollId === state.currentRollId)
        .map(d => d.value);

      const turnTotal = state.bankLocked + calculateScore(heldCurrent);

      if (state.activePlayer === "player1") {
        state.player1Score += turnTotal;
      } else {
        state.player2Score += turnTotal;
      }

      // check for entering final round
      if (!state.finalRound) {
        const currentScore =
          state.activePlayer === "player1" ? state.player1Score : state.player2Score;

        if (currentScore >= 10000) {
          state.finalRound = true;
          state.targetScore = currentScore;

          // give last turn to the other player
          state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
          resetTurnState(state);
          return;
        }
      } else {
        // Final round resolution
        const p1 = state.player1Score;
        const p2 = state.player2Score;

        if (p1 > p2 && p1 >= state.targetScore) {
          state.winner = state.player1Name;
        } else if (p2 > p1 && p2 >= state.targetScore) {
          state.winner = state.player2Name;
        } else if (p1 === p2) {
          state.winner = "It's a tie!";
        } else {
          // If the last player failed to beat target
          state.winner =
            state.activePlayer === "player1" ? state.player2Name : state.player1Name;
        }

        state.gameStarted = false; // stop game
        return;
      }

      // Normal turn switching
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      resetTurnState(state);
    },

    dismissSmokedOverlay(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      resetTurnState(state);
    },

    startRoll(state) {
      state.gameStarted = true;
      state.startingPlayer = null;
      resetTurnState(state);
    },

    resetGame: () => ({
      ...initialState,
      dice: Array(6).fill(null).map(makeDie), // ensure fresh dice
    }),
  },
});

export const {
  setPlayerName,
  setStartingPlayer,
  setDice,
  rollDice,
  toggleHold,
  endTurn,
  bankPointsAndEndTurn,
  dismissSmokedOverlay,
  startRoll,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;
