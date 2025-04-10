import React, { useState } from "react";
import { ExtendedCard, PlayerProfile } from "../types";
import Card from "./Card";
import "../styles/DeckManager.css";

interface DeckManagerProps {
  playerProfile: PlayerProfile;
  onProfileUpdate: (updatedProfile: PlayerProfile) => void;
  onClose: () => void;
}

const DeckManager: React.FC<DeckManagerProps> = ({
  playerProfile,
  onProfileUpdate,
  onClose
}) => {
  const [selectedCards, setSelectedCards] = useState<ExtendedCard[]>([
    ...playerProfile.currentDeck
  ]);
  const [activeTab, setActiveTab] = useState<"deck" | "collection">("deck");
  const maxDeckSize = 15;

  // Toggle card selection (add/remove from deck)
  const toggleCardSelection = (card: ExtendedCard) => {
    const isSelected = selectedCards.some((c) => c.id === card.id);

    if (isSelected) {
      // Remove from selected cards
      setSelectedCards(selectedCards.filter((c) => c.id !== card.id));
    } else {
      // Add to selected cards if under max size
      if (selectedCards.length < maxDeckSize) {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  // Save the current deck selection
  const saveDeck = () => {
    if (selectedCards.length < 5) {
      alert("Your deck must have at least 5 cards!");
      return;
    }

    const updatedProfile = {
      ...playerProfile,
      currentDeck: selectedCards
    };

    onProfileUpdate(updatedProfile);
    onClose();
  };

  // Filter collection to show only unique cards (not duplicates)
  const uniqueCollection = playerProfile.collection.filter(
    (card) => card.count > 0
  );

  return (
    <div className="deck-manager">
      <div className="deck-manager-header">
        <h2>Deck Manager</h2>
        <div className="deck-tabs">
          <button
            className={activeTab === "deck" ? "active" : ""}
            onClick={() => setActiveTab("deck")}
          >
            My Deck ({selectedCards.length}/{maxDeckSize})
          </button>
          <button
            className={activeTab === "collection" ? "active" : ""}
            onClick={() => setActiveTab("collection")}
          >
            Collection ({uniqueCollection.length})
          </button>
        </div>
      </div>

      <div className="deck-manager-content">
        {activeTab === "deck" ? (
          <div className="deck-grid">
            {selectedCards.length === 0 ? (
              <div className="empty-deck-message">
                Your deck is empty. Add cards from your collection.
              </div>
            ) : (
              selectedCards.map((card) => (
                <div
                  key={card.id}
                  className="deck-card-container"
                  onClick={() => toggleCardSelection(card)}
                >
                  <Card card={card} owner="blue" />
                  <div className="card-level-indicator">
                    Level: {card.level}/{card.maxLevel}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="collection-grid">
            {uniqueCollection.map((card) => {
              const isInDeck = selectedCards.some((c) => c.id === card.id);

              return (
                <div
                  key={card.id}
                  className={`collection-card-container ${
                    isInDeck ? "in-deck" : ""
                  }`}
                  onClick={() => toggleCardSelection(card)}
                >
                  <Card card={card} owner="blue" />
                  <div className="card-count">×{card.count}</div>
                  <div className="card-rarity">{card.rarity}</div>
                  <div className="card-level-indicator">
                    Level: {card.level}/{card.maxLevel}
                  </div>
                  {card.count >= 5 && card.level < card.maxLevel && (
                    <button
                      className="combine-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedProfile = combineCards(
                          playerProfile,
                          card.id
                        );
                        onProfileUpdate(updatedProfile);
                      }}
                    >
                      Combine 5 to Level Up
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="deck-manager-footer">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button className="save-button" onClick={saveDeck}>
          Save Deck
        </button>
      </div>
    </div>
  );
};

export default DeckManager;
