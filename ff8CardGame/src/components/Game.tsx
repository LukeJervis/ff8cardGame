import React, { useState, useEffect } from "react";
import Board from "./Board";
import PlayerHand from "./PlayerHand";
import GameStatus from "./GameStatus";
import RulesDisplay from "./RulesDisplay";
import { initializeGame, placeCard } from "../utils/gameLogic";
import { findBestMoveWithVariation } from "../utils/aiLogic";
import { GameState, Card, CellPosition, GameRule } from "../types";
import { getRandomHand } from "../data/cards";
import "../styles/Game.css";
import DeckManager from "./DeckManager";
import CardRewardScreen from "./CardRewardScreen";
import {
  loadPlayerProfile,
  savePlayerProfile,
  initializePlayerProfile,
  getCardRewards
} from "../utils/collectionManager";
import { MatchResult, PlayerProfile } from "../types";

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(
    initializeGame(["Open"])
  );
  const [availableRules, setAvailableRules] = useState<GameRule[]>([
    "Open",
    "Random",
    "Same",
    "Plus",
    "Same Wall",
    "Elemental",
    "Sudden Death"
  ]);
  const [selectedRules, setSelectedRules] = useState<GameRule[]>(["Open"]);
  const [isRuleSelectionOpen, setIsRuleSelectionOpen] =
    useState<boolean>(false);
  const [flippedPositions, setFlippedPositions] = useState<CellPosition[]>([]);
  const [boardAnimating, setBoardAnimating] = useState(false);
  const [lastPlacedPosition, setLastPlacedPosition] =
    useState<CellPosition | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    null
  );
  const [showDeckManager, setShowDeckManager] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [showRewardScreen, setShowRewardScreen] = useState(false);
  const [opponent, setOpponent] = useState<string>("Novice");

  // Load player profile on component mount
  useEffect(() => {
    const loadedProfile = loadPlayerProfile();
    if (loadedProfile) {
      setPlayerProfile(loadedProfile);
    } else {
      // Show player name input if no profile exists
      const playerName = prompt("Enter your name:") || "Player";
      const newProfile = initializePlayerProfile(playerName);
      setPlayerProfile(newProfile);
      savePlayerProfile(newProfile);
    }
  }, []);

  // When player profile changes, save it
  useEffect(() => {
    if (playerProfile) {
      savePlayerProfile(playerProfile);
    }
  }, [playerProfile]);

  // Update gameState.players[].hand with actual cards
  useEffect(() => {
    const updatedGameState = { ...gameState };
    updatedGameState.players[0].hand = getRandomHand(5);
    updatedGameState.players[1].hand = getRandomHand(5);
    setGameState(updatedGameState);
  }, []);

  // Add computer turn logic
  useEffect(() => {
    // Check if it's the computer's turn (red player)
    if (gameState.currentPlayer === "red" && !gameState.gameOver) {
      // Add a small delay to make the computer turn feel more natural
      const timer = setTimeout(() => {
        console.log("Computer's turn - making move");
        makeComputerMove();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameOver]);

  // Function to handle computer's move with improved AI
  const makeComputerMove = () => {
    if (gameState.gameOver) {
      console.log("Game is over, computer won't move");
      return;
    }

    console.log("Computer is thinking...");

    // Find the computer player (red)
    const computerPlayer = gameState.players.find((p) => p.color === "red");
    if (!computerPlayer || computerPlayer.hand.length === 0) {
      console.log("Computer has no cards or player not found");
      return;
    }

    try {
      // Use our AI to find the best move
      const bestMove = findBestMoveWithVariation(gameState);

      if (bestMove) {
        console.log(
          "Computer chose:",
          bestMove.card.name,
          "at position:",
          bestMove.position
        );

        const oldBoard = [...gameState.board];

        // Place the card
        const newGameState = placeCard(
          gameState,
          bestMove.position,
          bestMove.card
        );

        // Get the flipped positions
        const newFlippedPositions: CellPosition[] = [];

        newGameState.board.forEach((cell, index) => {
          const pos = index as CellPosition;
          // If this cell exists in both states but has different owners, it was flipped
          if (cell && oldBoard[pos] && cell.owner !== oldBoard[pos]!.owner) {
            newFlippedPositions.push(pos);
          }
        });

        // Update flipped positions state
        setFlippedPositions(newFlippedPositions);

        // Set animation states
        setLastPlacedPosition(bestMove.position);
        setBoardAnimating(true);

        // Reset animation states after delay
        setTimeout(() => {
          setBoardAnimating(false);
          setLastPlacedPosition(null);
        }, 1000);

        // Play sound effect
        playCardSound(newFlippedPositions.length > 0 ? "flip" : "place");

        setGameState({
          ...newGameState,
          selectedCard: null
        });
      } else {
        console.log("Computer couldn't find a valid move");
      }
    } catch (error) {
      console.error("Error in computer move:", error);
    }
  };

  const handleCardSelect = (card: Card) => {
    playCardSound("select");
    setGameState({
      ...gameState,
      selectedCard: card
    });
  };

  const handleCellClick = (position: CellPosition) => {
    if (
      gameState.selectedCard &&
      gameState.board[position] === null &&
      !gameState.gameOver
    ) {
      // Set animation states
      setLastPlacedPosition(position);
      setBoardAnimating(true);

      // Reset animation states after a delay
      setTimeout(() => {
        setBoardAnimating(false);
        setLastPlacedPosition(null);
      }, 1000);

      const newGameState = placeCard(
        gameState,
        position,
        gameState.selectedCard
      );

      // Get the flipped positions from comparing old and new board states
      const newFlippedPositions: CellPosition[] = [];

      newGameState.board.forEach((cell, index) => {
        const pos = index as CellPosition;
        // If this cell exists in both states but has different owners, it was flipped
        if (
          cell &&
          gameState.board[pos] &&
          cell.owner !== gameState.board[pos]!.owner
        ) {
          newFlippedPositions.push(pos);
        }
      });

      // Play sound effect
      playCardSound(newFlippedPositions.length > 0 ? "flip" : "place");

      // Update flipped positions state
      setFlippedPositions(newFlippedPositions);

      // Update game state
      setGameState({
        ...newGameState,
        selectedCard: null
      });
    }
  };

  const handleNewGame = () => {
    if (!playerProfile) return;

    const newGameState = initializeGame(selectedRules);

    // Use player's deck for blue player
    newGameState.players[0].hand = playerProfile.currentDeck.slice(0, 5);

    // AI opponent gets random cards based on difficulty
    let opponentCardLevel = 1;
    switch (opponent) {
      case "Master":
        opponentCardLevel = 8;
        break;
      case "Expert":
        opponentCardLevel = 6;
        break;
      case "Advanced":
        opponentCardLevel = 4;
        break;
      case "Intermediate":
        opponentCardLevel = 2;
        break;
      default:
        opponentCardLevel = 1;
    }

    newGameState.players[1].hand = getRandomHand(5, opponentCardLevel);

    setGameState(newGameState);
  };

  const handleRuleToggle = (rule: GameRule) => {
    if (selectedRules.includes(rule)) {
      // Remove rule
      setSelectedRules(selectedRules.filter((r) => r !== rule));
    } else {
      // Add rule
      setSelectedRules([...selectedRules, rule]);
    }
  };

  const currentPlayer = gameState.players.find(
    (p) => p.color === gameState.currentPlayer
  )!;

  const opponentPlayer = gameState.players.find(
    (p) => p.color !== gameState.currentPlayer
  )!;

  const isOpenRule = gameState.rules.includes("Open");

  // Add a simple sound effect player
  const playCardSound = (type: "place" | "flip" | "select" | "victory") => {
    const sounds = {
      place: "/sounds/card-place.mp3",
      flip: "/sounds/card-flip.mp3",
      select: "/sounds/card-select.mp3",
      victory: "/sounds/victory.mp3"
    };

    try {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.5;
      audio.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Update the game over check to handle rewards
  const handleGameOver = () => {
    if (!gameState.gameOver || !playerProfile) return;

    const playerScore = gameState.players[0].score;
    const opponentScore = gameState.players[1].score;

    // Determine currency and XP based on opponent difficulty and result
    let currencyGained = 10;
    let experienceGained = 5;

    switch (opponent) {
      case "Master":
        currencyGained = 100;
        experienceGained = 50;
        break;
      case "Expert":
        currencyGained = 50;
        experienceGained = 30;
        break;
      case "Advanced":
        currencyGained = 30;
        experienceGained = 20;
        break;
      case "Intermediate":
        currencyGained = 20;
        experienceGained = 10;
        break;
      default:
        currencyGained = 10;
        experienceGained = 5;
    }

    // Adjust rewards based on match result
    if (gameState.winner === "red") {
      currencyGained = Math.floor(currencyGained / 2);
      experienceGained = Math.floor(experienceGained / 2);
    } else if (gameState.winner === "draw") {
      currencyGained = Math.floor(currencyGained * 0.75);
      experienceGained = Math.floor(experienceGained * 0.75);
    }

    // Get cards to offer as rewards
    const opponentRank =
      {
        Novice: 1,
        Intermediate: 3,
        Advanced: 5,
        Expert: 7,
        Master: 10
      }[opponent] || 1;

    const cardsWon = getCardRewards(opponentRank);

    const result: MatchResult = {
      playerScore,
      opponentScore,
      winner: gameState.winner || "draw",
      cardsWon,
      currencyGained,
      experienceGained
    };

    setMatchResult(result);
    setShowRewardScreen(true);
  };

  // Check for game over after each move
  useEffect(() => {
    if (gameState.gameOver) {
      handleGameOver();
    }
  }, [gameState.gameOver]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Final Fantasy VIII - Triple Triad</h1>
        <div className="player-info">
          {playerProfile && (
            <>
              <div className="player-name">{playerProfile.name}</div>
              <div className="player-rank">
                Rank {playerProfile.currentRank}
              </div>
              <div className="player-currency">
                <span className="currency-icon">💰</span>
                {playerProfile.currency}
              </div>
              <div className="player-stats">
                {playerProfile.wins}W-{playerProfile.losses}L-
                {playerProfile.draws}D
              </div>
            </>
          )}
        </div>
        <div className="game-controls">
          {playerProfile && (
            <select
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              className="opponent-selector"
            >
              {playerProfile.unlockedOpponents.map((opp) => (
                <option key={opp} value={opp}>
                  {opp}
                </option>
              ))}
            </select>
          )}
          <button onClick={() => setShowDeckManager(true)}>Deck Manager</button>
          <button onClick={() => setIsRuleSelectionOpen(!isRuleSelectionOpen)}>
            {isRuleSelectionOpen ? "Hide Rules" : "Show Rules"}
          </button>
          <button onClick={handleNewGame}>New Game</button>
        </div>
      </div>

      {isRuleSelectionOpen && (
        <RulesDisplay
          activeRules={selectedRules}
          availableRules={availableRules}
          onRuleToggle={handleRuleToggle}
          isEditable={true}
        />
      )}

      <div className="game-area">
        <div
          className={`opponent-area ${
            gameState.currentPlayer === "red" ? "active" : ""
          }`}
        >
          <PlayerHand
            cards={opponentPlayer.hand}
            playerColor={opponentPlayer.color}
            onCardSelect={() => {}}
            selectedCard={null}
            isActive={false}
            rulesOpen={isOpenRule}
          />
        </div>

        <div className="board-area">
          <GameStatus gameState={gameState} onNewGame={handleNewGame} />
          <Board
            board={gameState.board}
            onCellClick={handleCellClick}
            highlightPossibleMoves={!!gameState.selectedCard}
            flippedPositions={flippedPositions}
            animating={boardAnimating}
            lastPlacedPosition={lastPlacedPosition}
          />
        </div>

        <div
          className={`player-area ${
            gameState.currentPlayer === "blue" ? "active" : ""
          }`}
        >
          <PlayerHand
            cards={currentPlayer.hand}
            playerColor={currentPlayer.color}
            onCardSelect={handleCardSelect}
            selectedCard={gameState.selectedCard}
            isActive={gameState.currentPlayer === "blue"}
            rulesOpen={true}
          />
        </div>
      </div>

      {/* Add deck manager modal */}
      {showDeckManager && playerProfile && (
        <div className="modal-overlay">
          <DeckManager
            playerProfile={playerProfile}
            onProfileUpdate={setPlayerProfile}
            onClose={() => setShowDeckManager(false)}
          />
        </div>
      )}

      {/* Add reward screen modal */}
      {showRewardScreen && matchResult && playerProfile && (
        <div className="modal-overlay">
          <CardRewardScreen
            matchResult={matchResult}
            playerProfile={playerProfile}
            onProfileUpdate={setPlayerProfile}
            onClose={() => setShowRewardScreen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Game;
