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

  heldDiceThisTurn: [],  // ⬅️ IMPORTANT: values of dice held across rolls

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

      state.activePlayer =
        firstValue > lastValue ? "player1" : "player2";

      state.isDecidingFirstPlayer = false;

      state.bank = 0;
      state.turnTotal = 0;
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.currentRollDieScores = {};
      state.smoked = false;
    },

    startGame(state) {
      state.gameStarted = true;
    },

    lockNames(state) {
      state.namesLocked = true;
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

      /* ---------- HOT DICE ---------- */
      if (state.dice.every(d => d.held)) {
        state.dice.forEach(d => (d.held = false));
      }

      /* ---------- ROLL UNHELD DICE ---------- */
      state.dice.forEach(d => {
        if (!d.held) {
          d.value = Math.floor(Math.random() * 6) + 1;
          d.sideIndex = Math.floor(Math.random() * 4);
        }
      });

      /* ---------- SCORE CURRENT ROLL ONLY ---------- */
      const unheldValues = state.dice
        .filter(d => !d.held)
        .map(d => d.value);

      const result = calculateScore(unheldValues);

      /* ---------- SMOKED ---------- */
      if (result.score === 0) {
        state.smoked = true;
        state.isRolling = false;
        state.currentRollScore = 0;
        state.currentRollScoringDice = [];
        state.currentRollDieScores = {};
        state.currentRollCombos = result.combos;
        state.turnTotal = state.bank;
        return;
      }

      /* ---------- MAP SCORING DICE ---------- */
      let map = [];
      let unheldIndex = 0;
      let dieScores = {};

      state.dice.forEach((d, i) => {
        if (!d.held) {
          if (result.scoringDice.includes(unheldIndex)) {
            map.push(i);
            dieScores[i] = result.dieScores[unheldIndex];
          }
          unheldIndex++;
        }
      });

      state.smoked = false;
      state.currentRollScore = result.score;
      state.currentRollScoringDice = map;
      state.currentRollDieScores = dieScores;
      state.turnTotal = state.bank + state.currentRollScore;

      console.log(
        "rollScore",
        state.currentRollScore,
        "bank",
        state.bank,
        "turnTotal",
        state.turnTotal
      );
    },


    /* ---------------- HOLD DIE ---------------- */

    toggleHold(state, action) {
      const idx = action.payload;
      if (!state.currentRollScoringDice.includes(idx)) return;

      const die = state.dice[idx];
      die.held = !die.held;

      state.currentRollCombos.forEach(combo => {
        if (!combo.diceIndexes.includes(idx)) return;

        combo.heldCount += die.held ? 1 : -1;

        if (combo.heldCount === combo.diceIndexes.length && !combo.fullyHeld) {
          state.bank += combo.score;
          combo.fullyHeld = true;
        }

        if (!die.held && combo.fullyHeld) {
          state.bank -= combo.score;
          combo.fullyHeld = false;
        }
      });

      state.turnTotal = state.bank;
    },  

    /* ---------------- BANK POINTS ---------------- */

    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;

      /* 🔥 SMOKED — immediate turn loss */
      if (state.smoked) {
        state.activePlayer =
          current === "player1" ? "player2" : "player1";

        state.bank = 0;
        state.turnTotal = 0;
        state.currentRollScore = 0;
        state.currentRollScoringDice = [];
        state.currentRollDieScores = {};
        state.heldDiceThisTurn = [];
        state.dice = createInitialDice();
        state.smoked = false;

        return;
      }

      /* 💰 NORMAL BANKING FLOW */
      const points = state.bank;

      if (!state[`${current}Open`]) {
        if (points < 1000) {
          state.activePlayer =
            current === "player1" ? "player2" : "player1";
          return;
        }
        state[`${current}Open`] = true;
      }

      if (current === "player1") state.player1Score += points;
      else state.player2Score += points;

      state.activePlayer =
        current === "player1" ? "player2" : "player1";

      // reset turn
      state.bank = 0;
      state.turnTotal = 0;
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.currentRollDieScores = {};
      state.heldDiceThisTurn = [];
      state.dice = createInitialDice();
    },

    resetGame() {
      return initialState;
    },
  },
});

export const {
  startRoll,
  stopRoll,
  setAnimatedDice,
  startGame,
  lockNames,
  gameStarted,
  setDecidingFirstPlayer,
  startRollForStartingPlayer,
  regularRoll,
  toggleHold,
  bankPointsAndEndTurn,
  dismissSmokedOverlay,
  setPlayerName,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;
