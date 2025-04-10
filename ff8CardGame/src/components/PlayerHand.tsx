import React from "react";
import { Card as CardType, PlayerColor } from "../types";
import Card from "./Card";
import "../styles/PlayerHand.css";

interface PlayerHandProps {
  cards: CardType[];
  playerColor: PlayerColor;
  onCardSelect: (card: CardType) => void;
  selectedCard: CardType | null;
  isActive: boolean;
  rulesOpen: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  playerColor,
  onCardSelect,
  selectedCard,
  isActive,
  rulesOpen
}) => {
  return (
    <div className={`player-hand ${isActive ? "active" : ""}`}>
      {cards.map((card) => (
        <div key={card.id} className="hand-card-container">
          <Card
            card={card}
            owner={playerColor}
            isSelected={selectedCard?.id === card.id}
            onClick={() => isActive && onCardSelect(card)}
            showFront={rulesOpen || playerColor === "blue"}
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
