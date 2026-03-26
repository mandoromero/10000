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

      // ----- HOT DICE: reset all dice if everything is held -----
      if (state.dice.every(d => d.held)) {
        state.dice.forEach(d => (d.held = false));
        state.heldDiceThisTurn = []; // reset banked dice if hot dice
        state.bank = 0;
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
        state.turnTotal = state.bank; // keep bank from previous held dice
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
      state.currentRollCombos = result.combos;

      // ----- TURN TOTAL = BANK + UNHELD SCORING DICE -----
      const currentRollPotential = Object.entries(dieScores)
        .filter(([i]) => !state.heldDiceThisTurn.find(d => d.index === Number(i)))
        .reduce((sum, [i, val]) => sum + val, 0);

      state.turnTotal = state.bank + currentRollPotential;

      console.log(
        "rollScore:", state.currentRollScore,
        "bank:", state.bank,
        "turnTotal:", state.turnTotal
      );    
    },

    /* ---------------- HOLD DIE ---------------- */

    toggleHold(state, action) {
      const idx = action.payload;

      // Only allow holding dice that scored in this roll or already held
      if (!state.currentRollScoringDice.includes(idx) && !state.heldDiceThisTurn.find(d => d.index === idx)) return;

      const die = state.dice[idx];
      die.held = !die.held;

      if (die.held) {
        // Add to heldDiceThisTurn if not already held
        if (!state.heldDiceThisTurn.find(d => d.index === idx)) {
          state.heldDiceThisTurn.push({
            index: idx,
            score: state.currentRollDieScores[idx], // store score at the time it was first held
          });
        }
      } else {
        // Remove die if unheld
        state.heldDiceThisTurn = state.heldDiceThisTurn.filter(d => d.index !== idx);
      }

      // ----- CONDITIONAL 3-OF-A-KIND LOGIC -----
      state.currentRollCombos.forEach(combo => {
        if (!combo.diceIndexes.includes(idx)) return;

        combo.heldCount += die.held ? 1 : -1;

        if (combo.heldCount === combo.diceIndexes.length && !combo.fullyHeld) {
          // Only add points when fully held
          state.bank += combo.score;
          combo.fullyHeld = true;

          // For conditional combos (2–6), update dieScores for UI
          if (combo.conditional) {
            combo.diceIndexes.forEach(i => {
              state.currentRollDieScores[i] = combo.score / combo.diceIndexes.length;
            });
          }
        }

        if (!die.held && combo.fullyHeld) {
          // Remove points if unholding fully held combo
          state.bank -= combo.score;
          combo.fullyHeld = false;

          if (combo.conditional) {
            combo.diceIndexes.forEach(i => {
              state.currentRollDieScores[i] = 0;
            });
          }
        }
      });

      // Recalculate turnTotal = bank + unheld scoring dice
      const currentRollScore = Object.entries(state.currentRollDieScores)
        .filter(([i]) => !state.heldDiceThisTurn.find(d => d.index === Number(i)))
        .reduce((sum, [i, val]) => sum + val, 0);

      state.turnTotal = state.bank + currentRollScore;
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
