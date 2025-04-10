import React from "react";
import { PlayerColor, GameState } from "../../../src/types";
import "../styles/GameStatus.css";

interface GameStatusProps {
  gameState: GameState;
  onNewGame: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState, onNewGame }) => {
  const { players, currentPlayer, gameOver, winner } = gameState;

  const bluePlayer = players.find((p) => p.color === "blue")!;
  const redPlayer = players.find((p) => p.color === "red")!;

  return (
    <div className="game-status">
      <div className="scores">
        <div
          className={`player-score ${currentPlayer === "blue" ? "active" : ""}`}
        >
          Player: {bluePlayer.score}
        </div>
        <div
          className={`player-score ${currentPlayer === "red" ? "active" : ""}`}
        >
          Opponent: {redPlayer.score}
        </div>
      </div>

      {gameOver && (
        <div className="game-result">
          <h2>
            {winner === "draw"
              ? "It's a draw!"
              : `${winner === "blue" ? "Player" : "Opponent"} wins!`}
          </h2>
          <button className="new-game-button" onClick={onNewGame}>
            New Game
          </button>
        </div>
      )}

      {!gameOver && (
        <div className="turn-indicator">
          {currentPlayer === "blue" ? "Your turn" : "Opponent's turn"}
        </div>
      )}
    </div>
  );
};

export default GameStatus;
