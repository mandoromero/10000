import { useEffect, useState } from "react-redux";
import { toggleHold } from "../../redux/diceSlice.js"
import DiceImage from "../DiceImage/DiceImage.jsx";
import HoldButton from "../HoldButton/HoldButton.jsx";
import "./Die.css";

export default function Die({ index, value, sideIndex, held, rolling }) {
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (rolling && !held) {
      setIsRolling(true);
      const timer = setTimeout(() => setIsRolling(false), 1000); // 1 second roll
      return () => clearTimeout(timer);
    }
  }, [rolling, held]);

  return (
    <div className={`die-container ${isRolling ? "die-rolling" : ""}`}>
      <div className="die">
        <DiceImage value={value} sideIndex={sideIndex} />
      </div>
      <HoldButton index={index} held={held} />
    </div>
  );
}