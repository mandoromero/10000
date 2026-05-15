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
  finalRoundStarter: null,
  winner: null,

  player1Name: "Player 1",
  player2Name: "Player 2",
  namesLocked: false,
  rollId: 0,
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
      state.rollId += 1;

      if (!state.gameStarted || state.winner || state.smoked) return;

      // 🎲 HOT DICE: if all dice are held → reset them
      if (state.dice.every(d => d.held)) {
        state.dice.forEach(d => (d.held = false));
      }

      // 🎲 ROLL ONLY UNHELD DICE
      state.dice.forEach(d => {
        if (!d.held) {
          d.value = Math.floor(Math.random() * 6) + 1;
          d.sideIndex = Math.floor(Math.random() * 4);
        }
      }); 

      // 📦 COLLECT UNHELD DICE
      const unheldDice = state.dice
        .map((d, i) => ({ value: d.value, index: i }))
        .filter(d => !state.dice[d.index].held);

      const valuesOnly = unheldDice.map(d => d.value);

      // 🧠 CALCULATE SCORE
      const result = calculateScore(valuesOnly);

      // 💀 SMOKED (no scoring dice)
      if (result.score === 0) {
        state.smoked = true;
        state.isRolling = false;
        console.log("SMOKED TRIGGERED");

        state.currentRollScore = 0;
        state.currentRollScoringDice = [];
        state.currentRollDieScores = {};
        state.currentRollCombos = [];

        state.bank = 0;
        state.turnTotal = 0;
        state.heldDiceThisTurn = [];

        return;
      }

      // 🎯 MAP SCORING DICE → REAL INDEXES
      const scoringDice = [];
      const dieScores = {};

      result.scoringDice.forEach(unheldIdx => {
        const realIdx = unheldDice[unheldIdx].index;

        scoringDice.push(realIdx);
        dieScores[realIdx] = result.dieScores[unheldIdx];
      });

      // ✅ SAVE STATE
      state.smoked = false;
      state.currentRollScore = result.score;
      state.currentRollScoringDice = scoringDice;
      state.currentRollDieScores = dieScores;

      // 🧩 MAP COMBOS → REAL INDEXES (UI only)
      state.currentRollCombos = result.combos.map(combo => ({
        ...combo,
        diceIndexes: combo.diceIndexes.map(unheldIdx =>
          unheldDice[unheldIdx].index
        )
      }));

      // 💰 TURN TOTAL = BANK + CURRENT ROLL
      state.turnTotal = state.bank + result.score;

      // 🧪 DEBUG (optional)
      console.log("ROLL VALUES:", valuesOnly);
      console.log("SCORING DICE:", scoringDice);
      console.log("ROLL SCORE:", result.score);
      console.log("BANK:", state.bank);
      console.log("TURN TOTAL:", state.turnTotal);

      
    },

    /* ---------------- HOLD DICE ---------------- */
    toggleHold(state, action) {
      const idx = action.payload;
      const die = state.dice[idx];

      // Only allow scoring dice
      const isScoringDie = state.currentRollScoringDice.includes(idx);

      if (!isScoringDie) return;

      // Toggle
      die.held = !die.held;

      // Add/remove from held list
      if (die.held) {
        const dieScore = state.currentRollDieScores[idx] || 0;

        state.bank += dieScore;
        state.heldDiceThisTurn.push({
          index: idx,
          value: die.value,
          rollId: state.rollId,
        });
      } else {
        // OPTIOINAL: alllow unholding (subtract score)
        const dieScore = state.currentRollDieScores[idx] || 0;

        state.bank -= dieScore;

        state.heldDiceThisTurn =
          state.heldDiceThisTurn.filter(d => d.index !== idx);
      }

      // ✅ BANK = sum of HELD dice scores ONLY (NO recompute logic)
      let newBank = 0;

      //group dice by roll
      const rolls = {};

      state.heldDiceThisTurn.forEach(d => {
        if (!rolls[d.rollId]) rolls[d.rollId] = [];
        rolls[d.rollId].push(d.value);
      });

      //calculate each roll separately
      Object.values(rolls).forEach(values => {
        const result = calculateScore(values);

        //IMPORTANT
        //only count full combos (not partial conditional ones)
        result.combos.forEach(combo => {
          if (!combo.contidional || combo.fullyHeld) {
            newBank += combo.score;
          }
        });
      });

      state.bank = newBank;

      // Update combo UI
      state.currentRollCombos.forEach(combo => {
        combo.heldCount = combo.diceIndexes.filter(i => state.dice[i].held).length;
        combo.fullyHeld = combo.heldCount === combo.diceIndexes.length;
      });

      // Turn total = bank + remaining roll score
      const unheldScore = Object.entries(state.currentRollDieScores)
        .filter(([i]) => !state.dice[i].held)
        .reduce((sum, [, val]) => sum + val, 0);

      state.turnTotal = state.bank + unheldScore;
    },

    /* ---------------- BANK POINTS ---------------- */
    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.bank;

      // Must open with 1000
      if (!state[`${current}Open`] && points < 1000) return;

      // Add score
      if (current === "player1") {
        state.player1Score += points;
      } else {
        state.player2Score += points;
      }

      // Open player
      if (!state[`${current}Open`]) {
        state[`${current}Open`] = true;
      }

      const player1 = state.player1Score;
      const player2 = state.player2Score;

      // -----------------------------------
      // START FINAL ROUND
      // -----------------------------------
      if (!state.finalRound && (player1 >= 10000 || player2 >= 10000)) {
        state.finalRound = true;
        state.finalRoundStarter = current;

        // Give opponent ONE final turn
        state.activePlayer =
          current === "player1" ? "player2" : "player1";
      }

      // -----------------------------------
      // FINAL ROUND COMPLETE
      // -----------------------------------
      else if (
        state.finalRound &&
        current !== state.finalRoundStarter
      ) {
        if (player1 > player2) {
          state.winner = state.player1Name;
        } else if (player2 > player1) {
          state.winner = state.player2Name;
        } else {
          state.winner = "It's a tie!";
        }
      }

      // -----------------------------------
      // NORMAL TURN SWITCH
      // -----------------------------------
      else {
        state.activePlayer =
          current === "player1" ? "player2" : "player1";
      }

      // Reset turn state
      state.dice = createInitialDice();
      state.bank = 0;
      state.turnTotal = 0;
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.currentRollDieScores = {};
      state.currentRollCombos = [];
      state.heldDiceThisTurn = [];
      state.smoked = false;
    },

    endTurnNoScore(state) {
      // Reset dice
      state.dice = createInitialDice();

      // Lose all turn points
      state.bank = 0;
      state.turnTotal = 0;

      // Clear current roll data
      state.currentRollScore = 0;
      state.currentRollScoringDice = [];
      state.currentRollDieScores = {};
      state.currentRollCombos = [];

      // Clear held dice
      state.heldDiceThisTurn = [];

      // Remove smoked overlay
      state.smoked = false;

      // Switch player
      state.activePlayer =
        state.activePlayer === "player1"
          ? "player2"
          : "player1";
    },

    /* ---------------- SMOKED OVERLAY ---------------- */
    dismissSmokedOverlay(state) {
      state.smoked = false;
    },

    resetGame() {
      return initialState;
    },  
  }
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
  endTurnNoScore,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;