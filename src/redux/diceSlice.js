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

        state.smoked = false;

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

      // ----- HOT DICE: reset all dice if everything is held -----
      if (state.dice.every(d => d.held)) {
        state.dice.forEach(d => (d.held = false));
      }

      // ----- ROLL ONLY UNHELD DICE -----
      state.dice.forEach(d => {
        if (!d.held) {
        d.value = Math.floor(Math.random() * 6) + 1;
          d.sideIndex = Math.floor(Math.random() * 4);
        }
      });

      // ----- COLLECT UNHELD VALUES FOR SCORING -----
      const unheldDice = [];
      state.dice.forEach((d, i) => {
        if (!d.held) unheldDice.push({ value: d.value, index: i });
      });

      const valuesOnly = unheldDice.map(d => d.value);
      const result = calculateScore(valuesOnly);

      // ----- SMOKED (NO SCORING DICE) -----
      if (result.score === 0) {
        state.smoked = true;
        state.isRolling = false;
        state.currentRollScore = 0;
        state.currentRollScoringDice = [];
        state.currentRollDieScores = {};
        state.currentRollCombos = [];
        state.turnTotal = 0; // banked points are lost
        state.bank = 0;
        state.heldDiceThisTurn = [];
        return;
      }

      // ----- MAP SCORING DICE TO REAL INDICES -----
      const scoringDice = [];
      const dieScores = {};
      result.scoringDice.forEach(unheldIdx => {
        const realIdx = unheldDice[unheldIdx].index;
        scoringDice.push(realIdx);

        // For conditional combos, only show score if already fully held
        const combo = result.combos.find(c => c.diceIndexes.includes(unheldIdx));
        if (combo?.conditional && !combo.fullyHeld) {
          dieScores[realIdx] = 0;
        } else {
          dieScores[realIdx] = result.dieScores[unheldIdx];
        }
      });

      // ----- FINALIZE STATE -----
      state.smoked = false;
      state.currentRollScore = result.score;
      state.currentRollScoringDice = scoringDice;
      state.currentRollDieScores = dieScores;

      state.currentRollCombos = result.combos.map(combo => ({
        ...combo, 
        diceIndexes: combo.diceIndexes.map(unheldIdx =>
          unheldDice[unheldIdx].index
        )
      }));

      // ----- TURN TOTAL = BANK + UNHELD SCORING DICE -----
      state.turnTotal = state.bank + result.score;

      console.log(
        "rollScore:", state.currentRollScore,
        "bank:", state.bank,
        "turnTotal:", state.turnTotal
      );    
    },

    /* ---------------- HOLD DIE ---------------- */

    toggleHold(state, action) {
      const idx = action.payload;
      const die = state.dice[idx];

      // ----- VALIDATE HOLD -----
      const isScoringDie = state.currentRollDieScores[idx] > 0;

      if (
        !isScoringDie &&
        !state.heldDiceThisTurn.find(d => d.index === idx)
      ) return;

      // ----- TOGGLE HOLD -----
      die.held = !die.held;

      // ----- UPDATE heldDiceThisTurn (NO RESET) -----
      if (die.held) {
        if (!state.heldDiceThisTurn.find(d => d.index === idx)) {
          state.heldDiceThisTurn.push({
            index: idx,
            value: die.value,
          });
        }
      } else {
        state.heldDiceThisTurn = state.heldDiceThisTurn.filter(
          d => d.index !== idx
        );
      }

      // ----- REBUILD BANK FROM ALL HELD DICE (ACROSS ROLLS) -----
      const counts = {};
      state.heldDiceThisTurn.forEach(d => {
        counts[d.value] = (counts[d.value] || 0) + 1;
      });

      let newBank = 0;

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
          // singles
          if (num === 1) newBank += count * 100;
          if (num === 5) newBank += count * 50;
        }
      });

      state.bank = newBank;

      // ----- UPDATE COMBO STATES FOR UI ONLY -----
      state.currentRollCombos.forEach(combo => {
        combo.heldCount = combo.diceIndexes.filter(i =>
          state.dice[i].held
        ).length;

        combo.fullyHeld = combo.heldCount === combo.diceIndexes.length;
      });

      // ----- UPDATE DIE SCORES FOR UI -----
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

      // ----- TURN TOTAL -----
      const unheldScore = Object.entries(newDieScores)
        .filter(([i]) => !state.dice[i].held)
        .reduce((sum, [, val]) => sum + val, 0);

      state.turnTotal = state.bank + unheldScore;
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
          state.currentRollCombo = [];

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
