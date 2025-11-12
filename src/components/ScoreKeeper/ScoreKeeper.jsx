import { useSelector } from "react-redux";
import formatScore from "../../formatScore.js";
import PlayerNameInput from "../PlayerNameInput/PlayerNameInput.jsx";
import "./ScoreKeeper.css";

export default function ScoreKeeper() {
  // Get all needed state from Redux
  const {
    player1Score = 0,
    player2Score = 0,
    bankPoints = 0,
    activePlayer = "player1",
    player1Name = "Player 1",
    player2Name = "Player 2",
  } = useSelector((state) => state.dice);

  // Helper to safely format numbers with leading zeros
  const formatBank = (value) => (value ?? 0).toString().padStart(5, "0");

  return (
    <div className="score-container">
      {/* Player 1 */}
      <div className="score">
        <div className={`player player1 ${activePlayer === "player1" ? "active" : ""}`}>
          <PlayerNameInput playerKey="player1" currentName={player1Name} />
        </div>
        <div className="player-1-score">{formatScore(player1Score)}</div>
      </div>

      {/* Bank */}
      <div className="score">
        <p className="banker">Bank</p>
        <div className="bank-points">{formatBank(bankPoints)}</div>
      </div>

      {/* Player 2 */}
      <div className="score">
        <div className={`player player2 ${activePlayer === "player2" ? "active" : ""}`}>
          <PlayerNameInput playerKey="player2" currentName={player2Name} />
        </div>
        <div className="player-2-score">{formatScore(player2Score)}</div>
      </div>
    </div>
  );
}
