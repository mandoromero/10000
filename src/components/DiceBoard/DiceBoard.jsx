import { useSelector } from "react-redux";
import Die from "../Die/Die.jsx";
import "../DiceBoard/DiceBoard.css";

export default function DiceBoard() {
    const dice =  useSelector((state) => state.dice.dice);

    return (
        <div className="dice-board">
            <div className="dice-row">
                {dice.map((die, index) => (
                    <Die 
                    key={index}
                    index={index}
                    value={die.value}
                    sideIndex={die.sideIndex}
                    held={die.held}
                />
                ))}
            </div>
        </div>
    );
}