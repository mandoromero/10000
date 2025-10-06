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
  player1Open: false,
  player2Open: false,
};

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
        //state check for final round
        if (state.finalRound && state.activePlayer === state.finalRoundFirstPlayer && !state.winner) 
          {return;}

      // Get all held dice for this roll
      const heldCurrent = state.dice
      .filter(d => d.held && !d.locked && d.rollId === state.currentRollId)
      .map(d => d.value);

      const turnTotal = state.bankLocked + calculateScore(heldCurrent);

      // Add to the active player's score
      if (state.activePlayer === "player1" && !state.player1Open && turnTotal < 1000) {
        return;
      }
      if (state.activePlayer === "player2" && !state.player2Open && turnTotal < 1000) {
        return;
      }
        if (state.activePlayer === "player1" && !state.player1Open && turnTotal >= 1000) {
          state.player1Open = true;
        }

        if (state.activePlayer === "player2" && !state.player2Open && turnTotal >= 1000) {
          state.player2Open = true;
        }

        if (state.activePlayer === "player1") {
          state.player1Score += turnTotal;
        } else {
          state.player2Score += turnTotal;
        }

      // --- Check if we need to enter the final round ---
      if (!state.finalRound) {
        const currentScore =
        state.activePlayer === "player1" ? state.player1Score : state.player2Score;

        if (currentScore >= 1000) {
          // Enter final round
          state.finalRound = true;
          state.targetScore = currentScore;
          state.finalRoundFirstPlayer = state.activePlayer; // Track who triggered final round

          // Give the other player one last turn
          state.activePlayer =
          state.activePlayer === "player1" ? "player2" : "player1";
          resetTurnState(state);
          return;
        }
      } else {
        // --- Final round resolution ---
        const p1 = state.player1Score;
        const p2 = state.player2Score;

        const firstPlayer = state.finalRoundFirstPlayer;
        const lastPlayer = firstPlayer === "player1" ? "player2" : "player1";

        // Decide winner
        if ((firstPlayer === "player1" && p1 > p2) || (firstPlayer === "player2" && p2 > p1)) {
          state.winner = firstPlayer === "player1" ? state.player1Name : state.player2Name;
        } else if ((lastPlayer === "player1" && p1 > p2) || (lastPlayer === "player2" && p2 > p1)) {
          state.winner = lastPlayer === "player1" ? state.player1Name : state.player2Name;
        } else {
          state.winner = "It's a tie!";
        }

        state.gameStarted = false; // Stop the game immediately
        return; // ✅ Prevent further turn switching
      }

      // State check for endgame
      if (state.winner) return;

      
      // --- Normal turn switching for regular gameplay ---
      state.activePlayer =
        state.activePlayer === "player1" ? "player2" : "player1";
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
