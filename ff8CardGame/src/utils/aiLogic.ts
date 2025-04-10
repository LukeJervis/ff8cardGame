import { GameState, Card, CellPosition } from "../types";
import { compareCards, getAdjacentPositions } from "./gameLogic";

// Interface for a move evaluation
interface MoveEvaluation {
  card: Card;
  position: CellPosition;
  score: number;
}

// Evaluate how good a specific card placement would be
export const evaluateMove = (
  gameState: GameState,
  position: CellPosition,
  card: Card
): number => {
  let score = 0;

  // If position is not empty, it's an invalid move
  if (gameState.board[position] !== null) {
    return -1000;
  }

  // Get adjacent positions and their contents
  const adjacentPositions = getAdjacentPositions(position);

  // Check if the position is a corner or edge (strategic advantage)
  if ([0, 2, 6, 8].includes(position)) {
    // Corner positions are valuable (only 2 sides exposed)
    score += 3;
  } else if ([1, 3, 5, 7].includes(position)) {
    // Edge positions are somewhat valuable (only 3 sides exposed)
    score += 1;
  }

  // Evaluate potential card flips
  let potentialFlips = 0;
  Object.entries(adjacentPositions).forEach(([direction, adjPosition]) => {
    if (adjPosition === null) return;

    const adjCell = gameState.board[adjPosition];
    if (!adjCell) return; // Empty cell

    // If adjacent card belongs to the opponent
    if (adjCell.owner !== "red") {
      // Check if our card would win against it
      if (
        compareCards(
          card,
          adjCell.card,
          direction as "top" | "right" | "bottom" | "left"
        )
      ) {
        potentialFlips++;
        score += 5; // Each potential flip is worth 5 points
      }
    } else {
      // Our own card is adjacent, it's good for defense
      score += 1;
    }
  });

  // Evaluate card strength (higher ranks = better card)
  const totalRanks = Object.values(card.ranks).reduce((sum, rank) => {
    return sum + (rank === "A" ? 10 : parseInt(rank.toString(), 10));
  }, 0);

  // Card strength is important, but not as much as flipping cards
  const cardStrength = totalRanks / 10;
  score += cardStrength;

  // Prioritize moves that flip multiple cards
  if (potentialFlips > 1) {
    score += potentialFlips * 2; // Bonus for multiple flips
  }

  // If no flips are possible with this move, reduce the score somewhat
  if (potentialFlips === 0) {
    score -= 2;
  }

  // Evaluate risk of playing this card (could it be flipped next turn?)
  let riskScore = 0;
  Object.entries(adjacentPositions).forEach(([direction, adjPosition]) => {
    if (adjPosition === null) return;

    // If adjacent cell is empty, check if playing there would flip our card
    if (gameState.board[adjPosition] === null) {
      // We don't know which card opponent will play, so evaluate average risk
      // based on our card's weakness in this direction
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

      const ourRank = card.ranks[oppositeDirections[direction]];
      const ourNumRank =
        ourRank === "A" ? 10 : parseInt(ourRank.toString(), 10);

      // Risk increases as our defensive rank decreases
      riskScore -= (10 - ourNumRank) / 2;
    }
  });

  // Add risk score (negative for high risk)
  score += riskScore;

  return score;
};

// Find all possible valid moves
export const findAllPossibleMoves = (
  gameState: GameState
): MoveEvaluation[] => {
  const computerPlayer = gameState.players.find((p) => p.color === "red")!;
  const moves: MoveEvaluation[] = [];

  // For each card in hand
  computerPlayer.hand.forEach((card) => {
    // For each position on the board
    for (let pos = 0; pos <= 8; pos++) {
      const position = pos as CellPosition;

      // If the position is empty
      if (gameState.board[position] === null) {
        // Evaluate this move
        const score = evaluateMove(gameState, position, card);
        moves.push({ card, position, score });
      }
    }
  });

  return moves;
};

// Find the best move for the computer
export const findBestMove = (
  gameState: GameState
): { card: Card; position: CellPosition } | null => {
  const possibleMoves = findAllPossibleMoves(gameState);

  if (possibleMoves.length === 0) {
    return null;
  }

  // Sort moves by score (highest first)
  possibleMoves.sort((a, b) => b.score - a.score);

  // Get the best move
  return {
    card: possibleMoves[0].card,
    position: possibleMoves[0].position
  };
};

// Add some randomness to make the AI less predictable (optional)
export const findBestMoveWithVariation = (
  gameState: GameState
): { card: Card; position: CellPosition } | null => {
  const possibleMoves = findAllPossibleMoves(gameState);

  if (possibleMoves.length === 0) {
    return null;
  }

  // Sort moves by score (highest first)
  possibleMoves.sort((a, b) => b.score - a.score);

  // Determine AI difficulty (higher = makes better moves more often)
  const aiDifficulty = 0.7; // 70% chance of making the best move

  // Sometimes make a suboptimal move to add unpredictability
  const randomFactor = Math.random();

  if (randomFactor < aiDifficulty || possibleMoves.length === 1) {
    // Make the best move
    return {
      card: possibleMoves[0].card,
      position: possibleMoves[0].position
    };
  } else {
    // Make a suboptimal move (randomly select among the top 3 moves if available)
    const moveIndex = Math.floor(
      Math.random() * Math.min(3, possibleMoves.length)
    );
    return {
      card: possibleMoves[moveIndex].card,
      position: possibleMoves[moveIndex].position
    };
  }
};
