import { useSelector } from "react-redux";
import formatScore from "../../formatScore.js";
import PlayerNameInput from "../PlayerNameInput/PlayerNameInput.jsx";
import "./ScoreKeeper.css";

export default function ScoreKeeper() {
  const player1Score = useSelector((state) => state.dice.player1Score);
  const bankPoints = useSelector((state) => state.dice.bankPoints);
  const player2Score = useSelector((state) => state.dice.player2Score);
  const activePlayer = useSelector((state) => state.dice.activePlayer);

  const player1Name = useSelector((state) => state.dice.player1Name);
  const player2Name = useSelector((state) => state.dice.player2Name);

  return (
    <div className="score-container">
      <div className="score">
        <div className={`player player1 ${activePlayer === "player1" ? "active" : ""}`}>
          <PlayerNameInput playerKey="player1" currentName={player1Name} />
        </div>
        <div className="player-1-score">{formatScore(player1Score)}</div>
      </div>

      <div className="score">
        <p className="banker">Bank</p>
        <div className="bank-points">{bankPoints.toString().padStart(5, "0")}</div>
      </div>

      <div className="score">
        <div className={`player computer ${activePlayer === "player2" ? "active" : ""}`}>
            <PlayerNameInput playerKey="player2" currentName={player2Name} />
        </div>

        <div className="player-2-score">{formatScore(player2Score)}</div>
      </div>
    </div>
  );
}
