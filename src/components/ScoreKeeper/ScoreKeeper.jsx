import "./ScoreKeeper.css";

export default function ScoreKeeper() {
    return (
        <div className="score-container">
            <div className="score">
                <p className="player player1">Player 1</p>
                <div className="player-1-score">00000</div>
            </div>
            <div className="score">
                <p className="banker">Bank</p>
                <div className="bank-points">00000</div>
            </div>
            <div className="score">
                <p className="player computer">Player 2</p>
                <div className="player-2-score">0</div>
            </div>
        </div>
    )
}