import { useDispatch, useSelector } from "react-redux";
import { bankPointsAndEndTurn, dismissSmokedOverlay } from "../../redux/diceSlice.js";
import "../GameButtons/GameButtons.css";

export default function GameButtons({ rollDisabled, onRoll }) {
  const dispatch = useDispatch();

  const {
    gameStarted,
    dice,
    activePlayer,
    player1Open,
    player2Open,
    winner,
    smoked,
    heldDiceThisTurn,
    bank,
    currentRollScore,
  } = useSelector((state) => state.dice);

  const allDiceHeld = dice.every(d => d.held);

  // ✅ Must hold at least 1 die AFTER a roll to continue
  const hasHeldDice = heldDiceThisTurn.length > 0;

  // ✅ First turn rule
  const firstTurn =
    activePlayer === "player1" ? !player1Open : !player2Open;

  // ----------------- ROLL -----------------
  const handleRoll = () => {
    if (!gameStarted || winner || smoked) return;

    // ❌ If NOT first roll AND no dice held → block
    if (currentRollScore > 0 && !hasHeldDice) return;

    onRoll();
  };

  // ----------------- BANK -----------------
  const handleBank = () => {
    if (!gameStarted || winner || smoked) return;

    dispatch(bankPointsAndEndTurn());
  };

  // ----------------- DISABLE LOGIC -----------------

  const rollDisabledComputed =
    !gameStarted ||
    !!winner ||
    smoked ||
    (currentRollScore > 0 && !hasHeldDice && !allDiceHeld) || // must hold at least 1 unless hot dice
    rollDisabled;

  const bankDisabled =
    !gameStarted ||
    !!winner ||
    smoked ||
    !hasHeldDice || // must have held something
    (firstTurn && bank < 1000); // must open with 1000+

  return (
    <div className="black-container">
      <div className="btns-container">
        <button
          className="roll-btn"
          onClick={handleRoll}
          disabled={rollDisabledComputed}
        >
          Roll
        </button>

        <button
          className="bank-btn"
          onClick={handleBank}
          disabled={bankDisabled}
        >
          Bank
        </button>
      </div>
    </div>
  );
}