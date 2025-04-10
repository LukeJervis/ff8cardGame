export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "A";

export interface CardRanks {
  top: CardValue;
  right: CardValue;
  bottom: CardValue;
  left: CardValue;
}

export interface Card {
  id: string;
  name: string;
  element?: Element;
  level: number;
  ranks: CardRanks;
  image?: string;
}

export type Element =
  | "Fire"
  | "Ice"
  | "Thunder"
  | "Water"
  | "Wind"
  | "Earth"
  | "Holy"
  | "Poison"
  | null;

export type PlayerColor = "blue" | "red";

export type CellPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CellContent {
  card: Card;
  owner: PlayerColor;
}

export type GameBoard = (CellContent | null)[];

export interface Player {
  color: PlayerColor;
  hand: Card[];
  score: number;
}

export type GameRule =
  | "Open"
  | "Random"
  | "Same"
  | "Plus"
  | "Same Wall"
  | "Elemental"
  | "Sudden Death";

export interface GameState {
  board: GameBoard;
  players: [Player, Player];
  currentPlayer: PlayerColor;
  rules: GameRule[];
  selectedCard: Card | null;
  gameOver: boolean;
  winner: PlayerColor | "draw" | null;
}

export interface CardFlipResult {
  flippedPositions: CellPosition[];
}

// Card rarity levels
export type CardRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

// Extended card type with additional properties
export interface ExtendedCard extends Card {
  rarity: CardRarity;
  level: number; // Card power level (1-10)
  maxLevel: number; // Maximum level this card can reach
  count: number; // How many copies the player has (for combining)
  unlocked: boolean; // If the player has unlocked this card
}

// Player profile to store progress
export interface PlayerProfile {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  collection: ExtendedCard[]; // All cards owned
  currentDeck: ExtendedCard[]; // Currently selected deck (max 15 cards)
  currency: number; // In-game currency for purchasing cards
  unlockedOpponents: string[]; // List of unlocked AI opponents
  currentRank: number; // Player's current rank/level
}

// Game save data
export interface GameSaveData {
  playerProfile: PlayerProfile;
  settings: GameSettings;
  lastPlayed: string; // ISO date string
  tutorialCompleted: boolean;
}

// Game settings
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficultyLevel: "Easy" | "Medium" | "Hard";
  animations: boolean;
}

// Match result for tracking outcomes
export interface MatchResult {
  playerScore: number;
  opponentScore: number;
  winner: PlayerColor | "draw";
  cardsWon: Card[];
  experienceGained: number;
  currencyGained: number;
}
