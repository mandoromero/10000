import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ idx, value, sideIndex, held, isRolling }) {
  return (
    <div className={`die-container ${isRolling ? "die-rolling" : ""}`}>
     
      <div className="die">
        <DiceImage value={value} sideIndex={sideIndex} />
      </div>

      <HoldButton idx={idx} held={held} />
    </div>
  );
}
