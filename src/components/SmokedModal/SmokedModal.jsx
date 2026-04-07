import { useDispatch } from "react-redux";
import { endTurnNoScore } from "../../redux/diceSlice";
import "./SmokedModal.css";

export default function SmokedModal() {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(endTurnNoScore());
  };

  return (
    <div className="smoked-overlay">
      <div className="smoked-modal">
        <p>No scoring dice! You smoked your turn.</p>
        <button className="smoked-btn" onClick={handleClose}>
          Close
        </button>
      </div>
      
    </div>
  );
}