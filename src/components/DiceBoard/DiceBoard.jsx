import { useSelector } from "react-redux";
import Die from "../Die/Die.jsx";
import "../DiceBoard/DiceBoard.css";

export default function DiceBoard({ isRolling }) {
  const dice = useSelector((state) => state.dice.dice);
  
  return (
    <div className="dice-board">
      {dice.map((die, idx) => (
    
        <Die
          key={idx}           
          idx={idx}           
          value={die.value}       
          sideIndex={die.sideIndex} 
          held={die.held || die.locked}         
          isRolling={isRolling} 
        />
      ))}
    </div>
  );
}
