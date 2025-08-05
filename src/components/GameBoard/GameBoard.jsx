import ScoreKeeper from "../ScoreKeeper/ScoreKeeper.jsx";
import GameButtons from "../GameButtons/GameButtons.jsx";
import DiceBoard from "../DiceBoard/DiceBoard.jsx";
import "../GameBoard/Gameboard.css";

export default function GameBoard() {
    return (
        <div className="game-board">
            <ScoreKeeper />
            <DiceBoard />
            <GameButtons />
        </div>
    )
}