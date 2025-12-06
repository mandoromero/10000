// src/components/ScoreKeeper/ScoreKeeper.jsx
import React from "react";
import { useSelector } from "react-redux";
import PlayerNameInput from "../PlayerNameInput/PlayerNameInput"
import "./ScoreKeeper.css";

export default function ScoreKeeper() {
  const player1Score = useSelector((state) => state.dice.player1Score);
  const player2Score = useSelector((state) => state.dice.player2Score);
  const turnTotal = useSelector((state) => state.dice.turnTotal);
  const activePlayer = useSelector((state) => state.dice.activePlayer);
  const player1Name = useSelector((state) => state.dice.player1Name);
  const player2Name = useSelector((state) => state.dice.player2Name);
  const finalRound = useSelector((state) => state.dice.finalRound);
  const winner = useSelector((state) => state.dice.winner);

  return (
    <div className="scorekeeper-container">
      <div className={`score-container ${activePlayer === "player1" ? "active" : ""}`}>
        <PlayerNameInput playerKey="player1" />
        <p>Score:</p>
        <p className="points">10000</p>
      </div>

      <div className="bank-points">
        <h3>Bank</h3>
        <p className="bank">10000</p>
      </div>

      <div className={`score-container ${activePlayer === "player2" ? "active" : ""}`}>
        <PlayerNameInput playerKey="player2" />
        <p>Score:</p>
        <p className="points">{player2Score}</p>
      </div>

      

      {finalRound && !winner && <p className="final-round-indicator">Final Round!</p>}
      {winner && <p className="winner-announcement">Winner: {winner}</p>}
    </div>
  );
}
