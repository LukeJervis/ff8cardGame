import { ExtendedCard, CardRarity, PlayerProfile } from "../types";
import { allCards } from "../data/cards";

// Initialize a new player profile
export const initializePlayerProfile = (name: string): PlayerProfile => {
  // Convert standard cards to extended cards for the starter deck
  const starterCards: ExtendedCard[] = allCards
    .filter((card) => card.level <= 2) // Only low-level cards for starters
    .slice(0, 10) // Limit to 10 cards
    .map((card) => ({
      ...card,
      rarity: determineCardRarity(card),
      maxLevel: determineMaxLevel(card),
      count: 1,
      unlocked: true
    }));

  return {
    name,
    wins: 0,
    losses: 0,
    draws: 0,
    collection: starterCards,
    currentDeck: starterCards.slice(0, 5), // Start with 5 cards in deck
    currency: 100, // Starting currency
    unlockedOpponents: ["Novice"],
    currentRank: 1
  };
};

// Determine card rarity based on card properties
export const determineCardRarity = (card: Card): CardRarity => {
  const totalValue = Object.values(card.ranks).reduce((sum, rank) => {
    return sum + (rank === "A" ? 10 : Number(rank));
  }, 0);

  if (totalValue >= 36) return "Legendary";
  if (totalValue >= 32) return "Epic";
  if (totalValue >= 28) return "Rare";
  if (totalValue >= 24) return "Uncommon";
  return "Common";
};

// Determine maximum level a card can reach based on rarity
export const determineMaxLevel = (card: Card): number => {
  const rarity = determineCardRarity(card);

  switch (rarity) {
    case "Legendary":
      return 10;
    case "Epic":
      return 8;
    case "Rare":
      return 6;
    case "Uncommon":
      return 4;
    case "Common":
      return 3;
    default:
      return 3;
  }
};

// Add a card to the player's collection
export const addCardToCollection = (
  profile: PlayerProfile,
  card: Card
): PlayerProfile => {
  const updatedProfile = { ...profile };

  // Check if player already has this card
  const existingCardIndex = updatedProfile.collection.findIndex(
    (c) => c.id === card.id
  );

  if (existingCardIndex !== -1) {
    // Increment count if player already has this card
    updatedProfile.collection[existingCardIndex].count += 1;
  } else {
    // Add new card to collection
    const extendedCard: ExtendedCard = {
      ...card,
      rarity: determineCardRarity(card),
      maxLevel: determineMaxLevel(card),
      count: 1,
      unlocked: true
    };
    updatedProfile.collection.push(extendedCard);
  }

  return updatedProfile;
};

// Combine 5 of the same card to level up
export const combineCards = (
  profile: PlayerProfile,
  cardId: string
): PlayerProfile => {
  const updatedProfile = { ...profile };
  const cardIndex = updatedProfile.collection.findIndex((c) => c.id === cardId);

  if (cardIndex === -1 || updatedProfile.collection[cardIndex].count < 5) {
    // Not enough cards to combine
    return profile;
  }

  const card = updatedProfile.collection[cardIndex];

  if (card.level >= card.maxLevel) {
    // Card is already at max level
    return profile;
  }

  // Consume 5 cards to level up
  updatedProfile.collection[cardIndex].count -= 5;
  updatedProfile.collection[cardIndex].level += 1;

  // Update card ranks based on new level (increase by 1 for each rank)
  const updatedRanks = { ...card.ranks };
  Object.keys(updatedRanks).forEach((dir) => {
    const direction = dir as keyof typeof updatedRanks;
    const currentValue = updatedRanks[direction];

    // Don't exceed 10 or "A"
    if (currentValue !== "A" && Number(currentValue) < 10) {
      updatedRanks[direction] = (Number(currentValue) + 1) as any;
    }
  });

  updatedProfile.collection[cardIndex].ranks = updatedRanks;

  // If this card is in the current deck, update it there too
  const deckIndex = updatedProfile.currentDeck.findIndex(
    (c) => c.id === cardId
  );
  if (deckIndex !== -1) {
    updatedProfile.currentDeck[deckIndex] = {
      ...updatedProfile.collection[cardIndex]
    };
  }

  return updatedProfile;
};

// Get cards the player can choose as rewards after a win
export const getCardRewards = (
  opponentRank: number,
  count: number = 3
): Card[] => {
  // Filter available rewards based on opponent's rank
  const availableRewards = allCards.filter((card) => {
    if (opponentRank <= 2) return card.level <= 3;
    if (opponentRank <= 4) return card.level <= 5;
    if (opponentRank <= 6) return card.level <= 7;
    return true; // At high ranks, all cards are available
  });

  // Randomly select cards for rewards
  const rewards: Card[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableRewards.length);
    rewards.push(availableRewards[randomIndex]);
  }

  return rewards;
};

// Update player stats after a match
export const updatePlayerStats = (
  profile: PlayerProfile,
  result: MatchResult
): PlayerProfile => {
  const updatedProfile = { ...profile };

  if (result.winner === "blue") {
    updatedProfile.wins += 1;
  } else if (result.winner === "red") {
    updatedProfile.losses += 1;
  } else {
    updatedProfile.draws += 1;
  }

  // Add currency
  updatedProfile.currency += result.currencyGained;

  // Increase rank if enough wins
  if (
    updatedProfile.wins >= updatedProfile.currentRank * 3 &&
    updatedProfile.currentRank < 10
  ) {
    updatedProfile.currentRank += 1;

    // Unlock new opponents based on rank
    if (updatedProfile.currentRank === 3) {
      updatedProfile.unlockedOpponents.push("Intermediate");
    } else if (updatedProfile.currentRank === 5) {
      updatedProfile.unlockedOpponents.push("Advanced");
    } else if (updatedProfile.currentRank === 7) {
      updatedProfile.unlockedOpponents.push("Expert");
    } else if (updatedProfile.currentRank === 10) {
      updatedProfile.unlockedOpponents.push("Master");
    }
  }

  return updatedProfile;
};

// Save player profile to localStorage
export const savePlayerProfile = (profile: PlayerProfile): void => {
  localStorage.setItem("playerProfile", JSON.stringify(profile));
};

// Load player profile from localStorage
export const loadPlayerProfile = (): PlayerProfile | null => {
  const savedProfile = localStorage.getItem("playerProfile");
  return savedProfile ? JSON.parse(savedProfile) : null;
};
