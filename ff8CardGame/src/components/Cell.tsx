import React from "react";
import { CellContent, CellPosition } from "../types";
import Card from "./Card";
import "../styles/Cell.css";

interface CellProps {
  content: CellContent | null;
  position: CellPosition;
  onClick: () => void;
  isHighlighted?: boolean;
  wasFlipped?: boolean;
  wasJustPlaced?: boolean;
}

const Cell: React.FC<CellProps> = ({
  content,
  position,
  onClick,
  isHighlighted = false,
  wasFlipped = false,
  wasJustPlaced = false
}) => {
  const cellClass = `
    game-cell 
    ${isHighlighted ? "highlighted" : ""} 
    ${wasJustPlaced ? "card-placed" : ""}
  `;

  return (
    <div className={cellClass} onClick={onClick}>
      {content ? (
        <Card
          card={content.card}
          owner={content.owner}
          wasFlipped={wasFlipped}
        />
      ) : (
        <div className="empty-cell">{position + 1}</div>
      )}
    </div>
  );
};

export default Cell;
