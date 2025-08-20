import { useSelector } from "react-redux";
import formatScore from "../../formatScore.js";
import "./ScoreKeeper.css";

export default function ScoreKeeper() {
    const player1Score = useSelector((state) => state.dice.player1Score);
    const bankPoints =  useSelector((state) => state.dice.bankPoints);
    const player2Score = useSelector((state) => state.dice.player2Score);
    const activePlayer = useSelector((state) => state.dice.activePlayer);

    return (
        <div className="score-container">
            <div className="score">
                <p className={`player player1 ${activePlayer ==="player1" ? "active" : ""}`}>Player 1</p>
                <div className="player-1-score">{formatScore(player1Score)}</div>
            </div>
            <div className="score">
                <p className="banker">Bank</p>
                <div className="bank-points">{bankPoints.toString().padStart(5, "0")}</div>
            </div>
            <div className="score">
                <p className={`player computer ${activePlayer === "player2" ? "active" : ""}`}>Player 2</p>
                <div className="player-2-score">{formatScore(player2Score)}</div>
            </div>
        </div>
    )
}