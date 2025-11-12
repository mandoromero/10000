import { createSlice } from "@reduxjs/toolkit";

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
      state.turnTotal = 0;
      state.winner = null;
      state.gameStarted = true;
    },

    stopRoll(state) {
      state.isRolling = false;
    },

    setDice(state, action) {
      state.dice = action.payload;
    },

    rollDice(state) {
      if (!state.gameStarted || state.winner) return;

        // Randomize each unlocked die
      state.dice = state.dice.map((die) => {
        if (die.locked) return die;
        return {
          ...die,
          value: Math.floor(Math.random() * 6) + 1,
          sideIndex: Math.floor(Math.random() * 4),
        };
      });

      // Store current roll for scoring
      state.currentRoll = state.dice.map((d) => d.value);
      state.currentRollScore = calculateScore(state.currentRoll);

      // Smoke check (no scoring combo)
      if (state.currentRollScore === 0) {
        state.smoked = true;
      }
    },


    setStartingPlayer(state, action) {
      state.activePlayer = action.payload;
    },

    toggleHold(state, action) {
      const idx = action.payload;
      state.dice[idx].held = !state.dice[idx].held;
    },

    addScore(state, action) {
      state.turnTotal += action.payload;
    },

    nextTurn(state) {
      state.activePlayer = state.activePlayer === "player1" ? "player2" : "player1";
      state.turnTotal = 0;
      state.dice = initialDice.map(d => ({ ...d, held: false }));
      state.isRolling = false;
    },

    setWinner(state, action) {
      state.winner = action.payload;
      state.isRolling = false;
      state.gameStarted = false;
    },

    setPlayerName(state, action) {
      const { player, name } = action.payload;
      if (player === "player1") state.player1Name = name;
      else if (player === "player2") state.player2Name = name;
    },

    // ✅ New reducer to bank points and end turn
    bankPointsAndEndTurn(state) {
      const current = state.activePlayer;
      const points = state.turnTotal;

      if (points === 0) {
        // Smoked — lose turn
        state.smoked = true;
        state.turnTotal = 0;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        return;
      }

      if (current === "player1") {
        state.player1Score += points;
      } else {
        state.player2Score += points;
      }

      const p1 = state.player1Score;
      const p2 = state.player2Score;

      // If someone hits 10,000+, mark final round or declare winner
      if (!state.finalRound && (p1 >= 10000 || p2 >= 10000)) {
        state.finalRound = true;
        state.activePlayer = current === "player1" ? "player2" : "player1";
        state.turnTotal = 0;
        return;
      }

      // If final round already happened → determine winner and end game
      if (state.finalRound && current === "player2") {
        if (p1 > p2) state.winner = state.player1Name;
        else if (p2 > p1) state.winner = state.player2Name;
        else state.winner = "It's a tie!";
        state.gameStarted = false;
        return;
      }

      // Normal next turn
      state.turnTotal = 0;
      state.activePlayer = current === "player1" ? "player2" : "player1";
    },

    dismissSmokedOverlay(state) {
      state.smoked = false;
    },

    resetGame() {
      return { ...initialState };
    },
  },
});

export const {
  startRoll,
  stopRoll,
  setDice,
  rollDice,
  setStartingPlayer,
  toggleHold,
  addScore,
  nextTurn,
  setWinner,
  setPlayerName,
  bankPointsAndEndTurn, // ✅ now exported
  dismissSmokedOverlay,
  resetGame,
} = diceSlice.actions;

export default diceSlice.reducer;
