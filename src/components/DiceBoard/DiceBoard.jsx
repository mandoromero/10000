import Die from "../Die/Die.jsx";
import { useSelector } from "react-redux";

export default function DiceBoard({ dice, onRollComplete }) {
    const rollTrigger = useSelector((state) => state.dice.rollTrigger);
    const gameStarted = useSelector((state) => state.dice.gameStarted);

    const shouldRoll = (index) => {
        if (!rollTrigger) return false;

        if (!gameStarted && (index === 0 || index ===5)) {
            return true;
        }

        if (gameStarted && !dice[index].held) {
            return true;
        }

        return false;
     };


    return (
        <div className="dice-container">
            {dice.map((die, index) =>(
                <Die 
                    key={index}
                    index={index}
                    value={die.value}
                    sideIndex={die.diceIndex}
                    shouldRoll={shouldRoll(index)}
                    onRollComplete={onRollComplete}
                />
            ))}
        </div>
    )
}