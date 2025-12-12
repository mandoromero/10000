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
  player1Open: false,
  player2Open: false,
  winner: null,
  player1Name: "Player 1",
  player2Name: "Player 2",
  namesLocked: false,
  finalRound: false,
  smoked: false,
  currentRoll: [],
  currentRollScore: 0,
  currentRollScoringDice: [],
  bank: 0, // Score from held dice
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

    setAnimatedDice(state, action) {
      state.dice = action.payload;
    },

    lockNames(state) {
      state.namesLocked = true;
    },

    // INITIAL STARTING PLAYER ROLL
    initialRollForStartingPlayer(state) {
      if (state.gameStarted) return;

      const firstDie = state.dice[0].value;
      const lastDie = state.dice[5].value;

      if (firstDie > lastDie) state.activePlayer = "player1";
      else if (lastDie > firstDie) state.activePlayer = "player2";
      else state.activePlayer = null; // tie, Start must be clicked again

      state.gameStarted = true;
      state.currentRoll = [firstDie, ...Array(4).fill(null), lastDie];
      state.currentRollScore = 0;
    },

    // REGULAR ROLL DURING PLAYER TURN
    regularRoll(state) {
      if (!state.gameStarted || state.winner) return;

      // Roll unheld dice
      state.dice = state.dice.map(d => ({
        ...d,
        value: d.held ? d.value : Math.floor(Math.random() * 6) + 1,
        sideIndex: d.held ? d.sideIndex : Math.floor(Math.random() * 4),
      }));

      // Values of dice that just rolled (exclude held)
      const currentRollValues = state.dice
        .map((d, idx) => (d.held ? null : d.value))
        .filter(v => v !== null);

      // Calculate score for current roll only (1s/5s three-of-a-kind rule applied)
      const { score, scoringDice } = calculateScore(currentRollValues);

      state.currentRoll = state.dice.map(d => d.value);
      state.currentRollScore = score;
      state.currentRollScoringDice = scoringDice;

      if (score === 0) {
        // Player "smoked" — no scoring dice
        state.smoked = true;
        state.turnTotal = 0;
        state.bank = 0;
      } else {
        state.smoked = false;

        // Calculate score from all held dice
        const heldValues = state.dice.filter(d => d.held).map(d => d.value);
        const heldScore = heldValues.length > 0 ? calculateScore(heldValues).score : 0;

        // Total turn score = held dice score + current roll score
        state.bank = heldScore;
        state.turnTotal = heldScore + score;
      }
    },

    // TOGGLE HOLD ON A DIE
    toggleHold(state, action) {
      const idx = action.payload;

      // Simply toggle the held state of the die
      state.dice[idx].held = !state.dice[idx].held;

      // Calculate score from all held dice
      const heldValues = state.dice.filter(d => d.held).map(d => d.value);
      const { score: heldScore } = calculateScore(heldValues);
      state.bank = heldScore;

      // Calculate score from unheld dice in current roll
      const unheldValues = state.dice.filter(d => !d.held).map(d => d.value);
      const { score: currentScore } = calculateScore(unheldValues);

      // Update turn total: held + unheld scoring dice
      state.turnTotal = heldScore + currentScore;
    },

    // BANK POINTS AND END TURN
    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.turnTotal;

      if (points === 0) {
        // Smoked
        state.smoked = true;
        state.turnTotal = 0;
        state.bank = 0;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        return;
      }

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

      // End game logic for final round
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
    },

    addScore(state, action) {
      state.turnTotal += action.payload;
    }, 

    nextTurn(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      state.turnTotal = 0;
      state.bank = 0;
      state.dice = initialDice.map(d => ({ ...d, held: false }));
      state.isRolling = false;
      state.smoked = false;
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
  setAnimatedDice,
  lockNames,
  toggleHold,
  addScore,
  nextTurn,
  bankPointsAndEndTurn,
  dismissSmokedOverlay,
  setPlayerName,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;
