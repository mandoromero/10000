import { useDispatch } from "react-redux";
import { dismissSmokedOverlay, bankPointsAndEndTurn } from "../../redux/diceSlice.js";

export default function SmokedModal({ show }) {
  const dispatch = useDispatch();

  if (!show) return null;

  const handleOk = () => {
    dispatch(dismissSmokedOverlay());   // hide the modal
    dispatch(bankPointsAndEndTurn());   // end turn
  };

  return (
    <div className="smoked-modal">
      <p>No scoring dice! Turn is smoked.</p>
      <button onClick={handleOk}>OK</button>
    </div>
  );
}
