// src/redux/diceSlice.js
import { createSlice } from "@reduxjs/toolkit";
import calculateScore from "../utils/calculateScore";

const createInitialDice = () =>
  Array.from({ length: 6 }, () => ({
    value: 1,
    sideIndex: 0,
    held: false,
  }));

const initialState = {
  dice: createInitialDice(),
  currentRollDieScores: {},
  currentRollCombos: [],
  isDecidingFirstPlayer: false,

  gameStarted: false,
  isRolling: false,

  activePlayer: null,

  player1Score: 0,
  player2Score: 0,
  player1Open: false,
  player2Open: false,

  bank: 0,               // points from HELD dice this turn
  turnTotal: 0,          // bank + currentRollScore

  currentRollScore: 0,   // score from current roll ONLY
  currentRollScoringDice: [],

  heldDiceThisTurn: [],  // holds all scoring dice held across rolls

  smoked: false,
  finalRound: false,
  winner: null,

  player1Name: "Player 1",
  player2Name: "Player 2",
  namesLocked: false,
};

const diceSlice = createSlice({
  name: "dice",
  initialState,
  reducers: {

    /* ---------------- START GAME ---------------- */
    startRollForStartingPlayer(state, action) {
      const { firstValue, lastValue } = action.payload;
      state.dice = createInitialDice();
      state.dice[0].value = firstValue;
      state.dice[5].value = lastValue;
      state.activePlayer = firstValue > lastValue ? "player1" : "player2";
      state.smoked = false;
      state.bank = 0;
      state.turnTotal = 0;
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.currentRollDieScores = {};
      state.heldDiceThisTurn = [];
    },

    startGame(state) {
      state.gameStarted = true;
    },

    lockNames(state) {
      state.namesLocked = true;
    },

    setPlayerName(state, action) {
      const { playerKey, name } = action.payload;
      state[playerKey + "Name"] = name;
    },

    setAnimatedDice(state, action) {
      state.dice = action.payload;
    },

    setDecidingFirstPlayer(state, action) {
      state.isDecidingFirstPlayer = action.payload;
    },

    startRoll(state) {
      state.isRolling = true;
    },

    stopRoll(state) {
      state.isRolling = false;
    },

    /* ---------------- ROLL DICE ---------------- */
    regularRoll(state) {
      if (!state.gameStarted || state.winner || state.smoked) return;

      // Hot dice: if all dice are held, reset held flags
      if (state.dice.every(d => d.held)) {
        state.dice.forEach(d => (d.held = false));
      }

      // Roll only unheld dice
      state.dice.forEach(d => {
        if (!d.held) {
          d.value = Math.floor(Math.random() * 6) + 1;
          d.sideIndex = Math.floor(Math.random() * 4);
        }
      });

      // Collect unheld values for scoring
      const unheldDice = state.dice
        .map((d, i) => ({ value: d.value, index: i, held: d.held }))
        .filter(d => !d.held);

      const valuesOnly = unheldDice.map(d => d.value);
      const result = calculateScore(valuesOnly);

      if (result.score === 0) {
        // Smoke: no scoring dice
        state.smoked = true;
        state.isRolling = false;
        state.currentRollScore = 0;
        state.currentRollScoringDice = [];
        state.currentRollDieScores = {};
        state.currentRollCombos = [];
        state.turnTotal = 0;
        state.bank = 0;
        state.heldDiceThisTurn = [];
        return;
      }

      // Map scoring dice to real indices
      const scoringDice = [];
      const dieScores = {};
      result.scoringDice.forEach(unheldIdx => {
        const realIdx = unheldDice[unheldIdx].index;
        scoringDice.push(realIdx);
        const combo = result.combos.find(c => c.diceIndexes.includes(unheldIdx));
        dieScores[realIdx] = combo?.conditional && !combo.fullyHeld
          ? 0
          : result.dieScores[unheldIdx];
      });

      state.smoked = false;
      state.currentRollScore = result.score;
      state.currentRollScoringDice = scoringDice;
      state.currentRollDieScores = dieScores;

      // Map combos to real dice indices
      state.currentRollCombos = result.combos.map(combo => ({
        ...combo,
        diceIndexes: combo.diceIndexes.map(unheldIdx => unheldDice[unheldIdx].index)
      }));

      // Turn total = bank + current roll score
      state.turnTotal = state.bank + result.score;
    },

    /* ---------------- HOLD DICE ---------------- */
    toggleHold(state, action) {
      const idx = action.payload;
      const die = state.dice[idx];

      // Only scoring dice can be held
      const isScoringDie = state.currentRollDieScores[idx] > 0;
      if (!isScoringDie) return;

      // Toggle held status
      die.held = !die.held;

      // Update heldDiceThisTurn (persists across rolls)
      if (die.held) {
        if (!state.heldDiceThisTurn.find(d => d.index === idx)) {
          state.heldDiceThisTurn.push({
            index: idx,
            value: die.value,
            rollId: state.rollId ?? Date.now(), // assign a rollId if not present
          });
        }
      } else {
        state.heldDiceThisTurn = state.heldDiceThisTurn.filter(d => d.index !== idx);
      }

      // ----- UPDATE BANK POINTS -----
      let newBank = 0;
      const rolls = {};

      state.heldDiceThisTurn.forEach(d => {
        if (!rolls[d.rollId]) rolls[d.rollId] = [];
        rolls[d.rollId].push(d.value);
      });

      Object.values(rolls).forEach(values => {
        const counts = {};
        values.forEach(v => counts[v] = (counts[v] || 0) + 1);

        Object.entries(counts).forEach(([numStr, count]) => {
          const num = Number(numStr);
          if (count >= 3) {
            if (num === 1) {
              if (count === 3) newBank += 1000;
              if (count === 4) newBank += 2000;
              if (count === 5) newBank += 4000;
              if (count === 6) newBank += 8000;
            } else {
              const base = num * 100;
              if (count === 3) newBank += base;
              if (count === 4) newBank += base * 2;
              if (count === 5) newBank += base * 4;
              if (count === 6) newBank += base * 8;
            }
          } else {
            if (num === 1) newBank += count * 100;
            if (num === 5) newBank += count * 50;
          }
        });
      });

      state.bank = newBank;

      // ----- UPDATE COMBO UI -----
      state.currentRollCombos.forEach(combo => {
        combo.heldCount = combo.diceIndexes.filter(i => state.dice[i].held).length;
        combo.fullyHeld = combo.heldCount === combo.diceIndexes.length;
      });

      // ----- UPDATE DIE SCORES -----
      const newDieScores = {};
      state.currentRollCombos.forEach(combo => {
        combo.diceIndexes.forEach(i => {
          if (combo.diceIndexes.length === 1) {
            newDieScores[i] = combo.score;
          } else {
            newDieScores[i] = combo.fullyHeld
              ? combo.score / combo.diceIndexes.length
              : combo.conditional
              ? 0
              : combo.score / combo.diceIndexes.length;
          }
        });
      });
      state.currentRollDieScores = newDieScores;

      // ----- UPDATE TURN TOTAL -----
      const unheldScore = Object.entries(newDieScores)
        .filter(([i]) => !state.dice[i].held)
        .reduce((sum, [, val]) => sum + val, 0);

      state.turnTotal = state.bank + unheldScore;
    },

    /* ---------------- BANK POINTS ---------------- */
    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.bank;

      // First-turn open rule: must bank 1000+
      if (!state[`${current}Open`] && points < 1000) return;

      // Add points to player's total
      if (current === "player1") state.player1Score += points;
      else state.player2Score += points;

      // Open player if first time
      if (!state[`${current}Open`]) state[`${current}Open`] = true;

      // Reset turn
      state.dice = createInitialDice();
      state.bank = 0;
      state.turnTotal = 0;
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.currentRollDieScores = {};
      state.heldDiceThisTurn = [];

      // Switch player
      state.activePlayer = current === "player1" ? "player2" : "player1";
    },

    /* ---------------- SMOKED OVERLAY ---------------- */
    dismissSmokedOverlay(state) {
      state.smoked = false;
    },

    resetGame() {
      return initialState;
    },
  },
});

export const {
  startRoll,
  stopRoll,
  regularRoll,
  toggleHold,
  bankPointsAndEndTurn,
  startRollForStartingPlayer,
  startGame,
  lockNames,
  setPlayerName,
  setAnimatedDice,
  setDecidingFirstPlayer,
  dismissSmokedOverlay,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;