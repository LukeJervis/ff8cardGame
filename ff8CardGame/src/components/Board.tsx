import React, { useState, useEffect } from "react";
import { GameBoard, CellPosition } from "../../../src/types";
import Cell from "./Cell";
import "../styles/Board.css";

interface BoardProps {
  board: GameBoard;
  onCellClick: (position: CellPosition) => void;
  highlightPossibleMoves?: boolean;
  flippedPositions?: CellPosition[];
}

const Board: React.FC<BoardProps> = ({
  board,
  onCellClick,
  highlightPossibleMoves = false,
  flippedPositions = []
}) => {
  const [recentlyFlipped, setRecentlyFlipped] = useState<CellPosition[]>([]);

  useEffect(() => {
    if (flippedPositions.length > 0) {
      setRecentlyFlipped(flippedPositions);

      const timer = setTimeout(() => {
        setRecentlyFlipped([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [flippedPositions]);

  const renderCells = () => {
    return board.map((cell, index) => {
      const position = index as CellPosition;
      const isValidMove = highlightPossibleMoves && board[position] === null;
      const wasFlipped = recentlyFlipped.includes(position);

      return (
        <Cell
          key={index}
          content={cell}
          position={position}
          onClick={() => onCellClick(position)}
          isHighlighted={isValidMove}
          wasFlipped={wasFlipped}
        />
      );
    });
  };

  return <div className="game-board">{renderCells()}</div>;
};

export default Board;
