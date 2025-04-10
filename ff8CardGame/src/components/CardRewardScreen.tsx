import React, { useState } from "react";
import { Card, MatchResult, PlayerProfile } from "../types";
import CardComponent from "./Card";
import {
  addCardToCollection,
  updatePlayerStats
} from "../utils/collectionManager";
import "../styles/CardRewardScreen.css";

interface CardRewardScreenProps {
  matchResult: MatchResult;
  playerProfile: PlayerProfile;
  onProfileUpdate: (updatedProfile: PlayerProfile) => void;
  onClose: () => void;
}

const CardRewardScreen: React.FC<CardRewardScreenProps> = ({
  matchResult,
  playerProfile,
  onProfileUpdate,
  onClose
}) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  const handleCardSelection = (index: number) => {
    setSelectedCardIndex(index);
  };

  const handleConfirm = () => {
    if (selectedCardIndex === null) return;

    // Add selected card to collection
    const selectedCard = matchResult.cardsWon[selectedCardIndex];
    let updatedProfile = addCardToCollection(playerProfile, selectedCard);

    // Update player stats
    updatedProfile = updatePlayerStats(updatedProfile, matchResult);

    onProfileUpdate(updatedProfile);
    onClose();
  };

  return (
    <div className="reward-screen">
      <div className="reward-header">
        <h2>
          {matchResult.winner === "blue"
            ? "Victory!"
            : matchResult.winner === "draw"
            ? "Draw!"
            : "Defeat!"}
        </h2>
        <div className="match-stats">
          <span>You: {matchResult.playerScore}</span>
          <span>Opponent: {matchResult.opponentScore}</span>
        </div>
      </div>

      {matchResult.winner === "blue" && (
        <div className="card-rewards">
          <h3>Choose a card reward:</h3>
          <div className="cards-grid">
            {matchResult.cardsWon.map((card, index) => (
              <div
                key={card.id}
                className={`reward-card ${
                  selectedCardIndex === index ? "selected" : ""
                }`}
                onClick={() => handleCardSelection(index)}
              >
                <CardComponent card={card} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reward-details">
        <div className="currency-gained">
          <span className="currency-icon">💰</span>
          <span>+{matchResult.currencyGained} Currency</span>
        </div>

        <div className="experience-gained">
          <span className="xp-icon">✨</span>
          <span>+{matchResult.experienceGained} Experience</span>
        </div>
      </div>

      <div className="reward-footer">
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={matchResult.winner === "blue" && selectedCardIndex === null}
        >
          {matchResult.winner === "blue" ? "Claim Reward" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CardRewardScreen;
