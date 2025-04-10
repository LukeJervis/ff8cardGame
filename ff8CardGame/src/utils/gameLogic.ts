import {
  GameState,
  Card,
  PlayerColor,
  CellPosition,
  CellContent,
  CardFlipResult
} from "../types";

// Check if a cell position is valid (0-8)
export const isValidPosition = (position: number): position is CellPosition => {
  return Number.isInteger(position) && position >= 0 && position <= 8;
};

// Convert a position (0-8) to row and column coordinates
export const positionToCoordinates = (
  position: CellPosition
): [number, number] => {
  const row = Math.floor(position / 3);
  const col = position % 3;
  return [row, col];
};

// Convert row and column coordinates to a position (0-8)
export const coordinatesToPosition = (
  row: number,
  col: number
): CellPosition | null => {
  if (row < 0 || row > 2 || col < 0 || col > 2) return null;
  const position = row * 3 + col;
  return isValidPosition(position) ? position : null;
};

// Get adjacent cell positions
export const getAdjacentPositions = (
  position: CellPosition
): {
  top: CellPosition | null;
  right: CellPosition | null;
  bottom: CellPosition | null;
  left: CellPosition | null;
} => {
  const [row, col] = positionToCoordinates(position);

  return {
    top: coordinatesToPosition(row - 1, col),
    right: coordinatesToPosition(row, col + 1),
    bottom: coordinatesToPosition(row + 1, col),
    left: coordinatesToPosition(row, col - 1)
  };
};

// Compare two cards at adjacent positions and determine if the attacking card wins
export const compareCards = (
  attackingCard: Card,
  defendingCard: Card,
  attackDirection: "top" | "right" | "bottom" | "left"
): boolean => {
  const oppositeDirections = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };

  const attackValue = attackingCard.ranks[attackDirection];
  const defendValue = defendingCard.ranks[oppositeDirections[attackDirection]];

  // Convert 'A' to 10 if needed
  const attackNum = attackValue === "A" ? 10 : Number(attackValue);
  const defendNum = defendValue === "A" ? 10 : Number(defendValue);

  return attackNum > defendNum;
};

// Check for the "Same" rule (if multiple cards are flipped with the same value)
export const checkSameRule = (
  gameState: GameState,
  position: CellPosition,
  card: Card,
  playerColor: PlayerColor
): CardFlipResult => {
  const flippedPositions: CellPosition[] = [];
  const adjacentPos = getAdjacentPositions(position);

  // Check each adjacent position
  Object.entries(adjacentPos).forEach(([direction, adjPosition]) => {
    if (adjPosition === null) return;

    const adjCell = gameState.board[adjPosition];
    if (!adjCell || adjCell.owner === playerColor) return;

    const typedDirection = direction as "top" | "right" | "bottom" | "left";
    const oppositeDirections: Record<
      string,
      "top" | "right" | "bottom" | "left"
    > = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right"
    };

    const attackValue = card.ranks[typedDirection];
    const defendValue = adjCell.card.ranks[oppositeDirections[direction]];

    if (attackValue === defendValue) {
      flippedPositions.push(adjPosition);
    }
  });

  return { flippedPositions };
};

// Check for the "Plus" rule
export const checkPlusRule = (
  gameState: GameState,
  position: CellPosition,
  card: Card,
  playerColor: PlayerColor
): CardFlipResult => {
  const flippedPositions: CellPosition[] = [];
  const adjacentPos = getAdjacentPositions(position);

  // Check each adjacent position
  Object.entries(adjacentPos).forEach(([direction, adjPosition]) => {
    if (adjPosition === null) return;

    const adjCell = gameState.board[adjPosition];
    if (!adjCell || adjCell.owner === playerColor) return;

    const typedDirection = direction as "top" | "right" | "bottom" | "left";
    const oppositeDirections: Record<
      string,
      "top" | "right" | "bottom" | "left"
    > = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right"
    };

    const attackValue = card.ranks[typedDirection];
    const defendValue = adjCell.card.ranks[oppositeDirections[direction]];

    const attackNum = attackValue === "A" ? 10 : Number(attackValue);
    const defendNum = defendValue === "A" ? 10 : Number(defendValue);

    // Plus rule: if the sum of ranks equals the sum of an adjacent card's ranks
    if (attackNum + defendNum === 10) {
      flippedPositions.push(adjPosition);
    }
  });

  return { flippedPositions };
};

// Place a card on the board and handle card flipping
export const placeCard = (
  gameState: GameState,
  position: CellPosition,
  card: Card
): GameState => {
  if (!isValidPosition(position) || gameState.board[position] !== null) {
    return gameState; // Invalid move
  }

  // Create a copy of the current game state
  const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const currentPlayer = newGameState.players.find(
    (p) => p.color === newGameState.currentPlayer
  )!;

  // Place the card on the board
  newGameState.board[position] = {
    card,
    owner: currentPlayer.color
  };

  // Remove the card from the player's hand
  currentPlayer.hand = currentPlayer.hand.filter((c) => c.id !== card.id);

  // Check adjacent cells and flip cards if needed
  const adjacentPositions = getAdjacentPositions(position);
  const flippedPositions: CellPosition[] = [];

  // Regular flipping based on card rank comparison
  Object.entries(adjacentPositions).forEach(([direction, adjPosition]) => {
    if (adjPosition === null) return;

    const adjCell = newGameState.board[adjPosition];
    if (!adjCell || adjCell.owner === currentPlayer.color) return;

    if (
      compareCards(
        card,
        adjCell.card,
        direction as "top" | "right" | "bottom" | "left"
      )
    ) {
      flippedPositions.push(adjPosition);
    }
  });

  // Apply special rules if they are active
  let specialRuleFlips: CellPosition[] = [];

  if (newGameState.rules.includes("Same")) {
    const sameResult = checkSameRule(
      newGameState,
      position,
      card,
      currentPlayer.color
    );
    specialRuleFlips = [...specialRuleFlips, ...sameResult.flippedPositions];
  }

  if (newGameState.rules.includes("Plus")) {
    const plusResult = checkPlusRule(
      newGameState,
      position,
      card,
      currentPlayer.color
    );
    specialRuleFlips = [...specialRuleFlips, ...plusResult.flippedPositions];
  }

  // Combine standard flips and special rule flips
  const allFlippedPositions = [
    ...new Set([...flippedPositions, ...specialRuleFlips])
  ];

  // Flip all affected cards
  allFlippedPositions.forEach((pos) => {
    if (newGameState.board[pos]) {
      newGameState.board[pos]!.owner = currentPlayer.color;
    }
  });

  // Update scores
  updateScores(newGameState);

  // Check if the game is over
  checkGameOver(newGameState);

  // Switch to the other player if the game isn't over
  if (!newGameState.gameOver) {
    newGameState.currentPlayer =
      newGameState.currentPlayer === "blue" ? "red" : "blue";
  }

  return newGameState;
};

// Update the scores for both players
export const updateScores = (gameState: GameState): void => {
  const [player1, player2] = gameState.players;

  player1.score = gameState.board.filter(
    (cell) => cell && cell.owner === player1.color
  ).length;
  player2.score = gameState.board.filter(
    (cell) => cell && cell.owner === player2.color
  ).length;
};

// Check if the game is over and determine the winner
export const checkGameOver = (gameState: GameState): void => {
  // Game is over when all cells are filled or both players have no cards left
  const isBoardFull = gameState.board.every((cell) => cell !== null);
  const playersHaveNoCards = gameState.players.every(
    (player) => player.hand.length === 0
  );

  if (isBoardFull || playersHaveNoCards) {
    gameState.gameOver = true;

    const [player1, player2] = gameState.players;

    if (player1.score > player2.score) {
      gameState.winner = player1.color;
    } else if (player2.score > player1.score) {
      gameState.winner = player2.color;
    } else {
      gameState.winner = "draw";
    }
  }
};

// Initialize a new game state
export const initializeGame = (
  rules: GameState["rules"] = ["Open"]
): GameState => {
  const blueHand = getRandomHand();
  const redHand = getRandomHand();

  return {
    board: Array(9).fill(null),
    players: [
      { color: "blue", hand: blueHand, score: 0 },
      { color: "red", hand: redHand, score: 0 }
    ],
    currentPlayer: "blue",
    rules,
    selectedCard: null,
    gameOver: false,
    winner: null
  };
};

// Import this from cards.ts
const getRandomHand = (count: number = 5): Card[] => {
  // Placeholder - this should import from the actual cards data
  // For testing purposes, we'll create some simple cards
  const generateCard = (id: string): Card => ({
    id,
    name: `Card ${id}`,
    level: 1,
    ranks: {
      top: Math.floor(Math.random() * 9 + 1) as CardValue,
      right: Math.floor(Math.random() * 9 + 1) as CardValue,
      bottom: Math.floor(Math.random() * 9 + 1) as CardValue,
      left: Math.floor(Math.random() * 9 + 1) as CardValue
    }
  });

  return Array.from({ length: count }, (_, i) => generateCard(`temp-${i}`));
};
