import "./ScoreKeeper.css";

export default function ScoreKeeper({ activePlayer }) {
    return (
        <div className="score-container">
            <div className="score">
                <p className={`player player1 ${activePlayer ==="player1" ? "active" : ""}`}>Player 1</p>
                <div className="player-1-score">00000</div>
            </div>
            <div className="score">
                <p className="banker">Bank</p>
                <div className="bank-points">00000</div>
            </div>
            <div className="score">
                <p className={`player computer ${activePlayer === "player2" ? "active" : ""}`}>Player 2</p>
                <div className="player-2-score">00000</div>
            </div>
        </div>
    )
}