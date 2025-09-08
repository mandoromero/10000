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
      state.bankPoints = 0; 
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.dice = state.dice.map(d => ({ ...d, held: false }));
      state.smoked = false;
    },

    bankPointsAndEndTurn(state) {
      const heldCurrent = state.dice
        .filter(d => d.held && !d.locked && d.rollId === state.currentRollId)
        .map(d => d.value);

      const turnTotal = state.bankLocked + calculateScore(heldCurrent);

      if (state.activePlayer === "player1") {
        if (state.player1Score + turnTotal >= 1000) {
          state.player1Score += turnTotal;
        }
      } else {
          if (state.player2Score + turnTotal >= 1000) {
          state.player2Score += turnTotal;
      }}



      // if (state.activePlayer === "player1") state.player1Score += turnTotal;
      // else state.player2Score += turnTotal;

      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";

      state.bankLocked = 0;
      state.bankPoints = 0;
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.currentRollId = null;
      state.smoked = false;
      state.dice = state.dice.map(makeDie);
    },

    dismissSmokedOverlay(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      state.bankLocked = 0;
      state.bankPoints = 0;
      state.currentRollScore = 0;
      state.currentRoll = [];
      state.currentRollId = null;
      state.smoked = false;
      state.dice = state.dice.map(makeDie);
    },

    startRoll(state) {
      state.gameStarted = true;
      state.startingPlayer = null;
      state.bankLocked = 0;
      state.bankPoints = 0;
      state.currentRoll = [];
      state.currentRollScore = 0;
      state.currentRollId = null;
      state.smoked = false;
      state.dice = state.dice.map(makeDie);
    },
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
} = diceSlice.actions;

export default diceSlice.reducer;
