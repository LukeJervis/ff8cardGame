import React, { useState, useEffect } from "react";
import { Card as CardType, PlayerColor } from "../../../src/types";
import "../styles/Card.css";

interface CardProps {
  card: CardType;
  owner?: PlayerColor;
  isSelected?: boolean;
  onClick?: () => void;
  showFront?: boolean;
  wasFlipped?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  owner,
  isSelected = false,
  onClick,
  showFront = true,
  wasFlipped = false
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (wasFlipped) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [wasFlipped]);

  const cardClass = `
    card 
    ${owner ? `card-${owner}` : ""} 
    ${isSelected ? "selected" : ""}
    ${card.element ? `element-${card.element.toLowerCase()}` : ""}
    ${isFlipping ? "flipping" : ""}
    ${owner ? `owner-${owner}` : ""}
  `;

  if (!showFront) {
    return (
      <div
        className={`card card-back ${owner ? `card-${owner}` : ""} ${
          owner ? `owner-${owner}` : ""
        }`}
        onClick={onClick}
      >
        <div className="card-back-design"></div>
      </div>
    );
  }

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="card-header">
        <span className="card-name">{card.name}</span>
        <span className="card-level">Lvl {card.level}</span>
      </div>

      <div className="card-content">
        {card.image ? (
          <img src={card.image} alt={card.name} className="card-image" />
        ) : (
          <div className="card-placeholder">{card.name[0]}</div>
        )}

        <div className="card-ranks">
          <div className="rank rank-top">{card.ranks.top}</div>
          <div className="rank rank-right">{card.ranks.right}</div>
          <div className="rank rank-bottom">{card.ranks.bottom}</div>
          <div className="rank rank-left">{card.ranks.left}</div>
        </div>
      </div>

      {card.element && (
        <div className={`card-element element-${card.element.toLowerCase()}`}>
          {card.element}
        </div>
      )}
    </div>
  );
};

export default Card;
