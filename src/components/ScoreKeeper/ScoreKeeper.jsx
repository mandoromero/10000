// src/components/ScoreKeeper/ScoreKeeper.jsx
import React from "react";
import { useSelector } from "react-redux";
import PlayerNameInput from "../PlayerNameInput/PlayerNameInput";
import "./ScoreKeeper.css";

export default function ScoreKeeper() {
  const {
    player1Score,
    player2Score,
    turnTotal,
    activePlayer,
    player1Name,
    player2Name,
    finalRound,
    winner,
    bank,
  } = useSelector((state) => state.dice);

  return (
    <div className="scorekeeper-container">
      
      {/* PLAYER 1 */}
      <div
        className={`score-container ${
          activePlayer === "player1" ? "active" : ""
        }`}
      >
        <PlayerNameInput playerKey="player1" activePlayer={activePlayer} />

        <div className="points-display">
          <p>Score:</p>
          <p className="points">{player1Score}</p>
        </div>
      </div>

      {/* BANK DISPLAY */}
      <div className="bank-points">
        <h3>Bank</h3>
        <p className="bank">{bank}</p>
      </div>

      {/* PLAYER 2 */}
      <div
        className={`score-container ${
          activePlayer === "player2" ? "active" : ""
        }`}
      >
        <PlayerNameInput playerKey="player2" activePlayer={activePlayer} />

        <div className="points-display">
          <p>Score:</p>
          <p className="points">{player2Score}</p>
        </div>
      </div>

      {/* STATUS DISPLAY */}
      {finalRound && !winner && (
        <p className="final-round-indicator">Final Round!</p>
      )}
      {winner && <p className="winner-announcement">Winner: {winner}</p>}
    </div>
  );
}
