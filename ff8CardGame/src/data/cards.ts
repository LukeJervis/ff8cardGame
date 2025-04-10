import { Card, Element } from "../types";

export const generateCardId = () => Math.random().toString(36).substring(2, 10);

export const createCard = (
  name: string,
  level: number,
  top: number,
  right: number,
  bottom: number,
  left: number,
  element: Element = null
): Card => ({
  id: generateCardId(),
  name,
  level,
  ranks: { top, right, bottom, left },
  element
});

// Level 1 cards
export const level1Cards: Card[] = [
  createCard("Geezard", 1, 1, 4, 5, 1),
  createCard("Funguar", 1, 5, 1, 1, 3),
  createCard("Bite Bug", 1, 1, 3, 3, 5),
  createCard("Red Bat", 1, 6, 1, 1, 2),
  createCard("Blobra", 1, 2, 3, 1, 5),
  createCard("Gayla", 1, 2, 1, 4, 4, "Thunder"),
  createCard("Gesper", 1, 1, 5, 4, 1),
  createCard("Fastitocalon-F", 1, 3, 5, 2, 1, "Earth"),
  createCard("Blood Soul", 1, 2, 1, 6, 1),
  createCard("Caterchipillar", 1, 4, 2, 4, 3)
];

// Level 2 cards
export const level2Cards: Card[] = [
  createCard("Cockatrice", 2, 2, 1, 2, 6),
  createCard("Grat", 2, 7, 1, 3, 1),
  createCard("Buel", 2, 6, 2, 2, 3),
  createCard("Mesmerize", 2, 5, 3, 3, 4),
  createCard("Glacial Eye", 2, 6, 1, 4, 3, "Ice"),
  createCard("Belhelmel", 2, 3, 4, 5, 3),
  createCard("Thrustaevis", 2, 5, 3, 2, 5, "Wind"),
  createCard("Anacondaur", 2, 5, 1, 3, 5, "Poison"),
  createCard("Creeps", 2, 5, 2, 5, 2),
  createCard("Grendel", 2, 4, 4, 5, 2),
  createCard("Jelleye", 2, 3, 2, 1, 7),
  createCard("Grand Mantis", 2, 5, 2, 5, 3)
];

// Level 3 cards
export const level3Cards: Card[] = [
  createCard("Forbidden", 3, 6, 6, 3, 2),
  createCard("Armadodo", 3, 6, 3, 1, 6, "Earth"),
  createCard("Tri-Face", 3, 3, 5, 5, 5, "Poison"),
  createCard("Fastitocalon", 3, 7, 5, 1, 3, "Earth"),
  createCard("Snow Lion", 3, 7, 1, 5, 3, "Ice"),
  createCard("Ochu", 3, 5, 6, 3, 3),
  createCard("SAM08G", 3, 5, 6, 2, 4, "Fire"),
  createCard("Death Claw", 3, 4, 4, 7, 2),
  createCard("Cactuar", 3, 6, 2, 6, 3)
];

// Level 4 cards
export const level4Cards: Card[] = [
  createCard("Tonberry", 4, 3, 6, 4, 7),
  createCard("Abyss Worm", 4, 7, 2, 3, 7, "Earth"),
  createCard("Turtapod", 4, 2, 3, 7, 6),
  createCard("Vysage", 4, 6, 5, 5, 4),
  createCard("T-Rexaur", 4, 4, 6, 6, 5),
  createCard("Bomb", 4, 2, 7, 6, 3, "Fire"),
  createCard("Blitz", 4, 1, 6, 4, 7, "Thunder"),
  createCard("Wendigo", 4, 7, 3, 1, 6)
];

// Level 5 cards
export const level5Cards: Card[] = [
  createCard("Torama", 5, 7, 4, 4, 5),
  createCard("Imp", 5, 3, 7, 6, 4),
  createCard("Blue Dragon", 5, 6, 2, 7, 5, "Poison"),
  createCard("Adamantoise", 5, 4, 5, 6, 6, "Earth"),
  createCard("Hexadragon", 5, 7, 5, 4, 5, "Fire"),
  createCard("Iron Giant", 5, 6, 5, 6, 5),
  createCard("Behemoth", 5, 3, 6, 5, 7),
  createCard("Chimera", 5, 7, 6, 5, 3, "Water"),
  createCard("PuPu", 5, 3, 1, 10, 2)
];

// Level 6 and above cards (rare and boss cards)
export const bossCards: Card[] = [
  createCard("Ultimecia", 10, 10, 10, 10, 10),
  createCard("Griever", 9, 9, 9, 9, 9),
  createCard("Bahamut", 9, 10, 8, 7, 6, "Holy"),
  createCard("Ifrit", 8, 9, 6, 8, 2, "Fire"),
  createCard("Shiva", 8, 9, 7, 3, 8, "Ice"),
  createCard("Quezacotl", 8, 2, 9, 9, 6, "Thunder"),
  createCard("Diablos", 8, 5, 10, 8, 3),
  createCard("Leviathan", 7, 7, 10, 4, 7, "Water"),
  createCard("Odin", 7, 8, 5, 3, 10),
  createCard("Cerberus", 7, 7, 6, 10, 4),
  createCard("Alexander", 7, 9, 2, 4, 10, "Holy"),
  createCard("Phoenix", 7, 7, 7, 8, 4, "Fire"),
  createCard("Carbuncle", 6, 4, 10, 4, 8),
  createCard("Doomtrain", 6, 3, 10, 10, 1, "Poison"),
  createCard("Eden", 10, 10, 9, 10, 8, "Holy")
];

// Character cards
export const characterCards: Card[] = [
  createCard("Squall", 10, 10, 6, 9, 4),
  createCard("Zell", 10, 8, 6, 5, 10),
  createCard("Rinoa", 10, 4, 10, 10, 2),
  createCard("Quistis", 10, 9, 6, 10, 2),
  createCard("Irvine", 10, 2, 6, 9, 10),
  createCard("Selphie", 10, 10, 8, 4, 6),
  createCard("Seifer", 10, 6, 9, 10, 4),
  createCard("Edea", 10, 10, 3, 3, 10),
  createCard("Laguna", 10, 5, 10, 3, 9),
  createCard("Kiros", 10, 6, 7, 10, 6),
  createCard("Ward", 10, 10, 2, 8, 7)
];

// Combined collection of all cards
export const allCards: Card[] = [
  ...level1Cards,
  ...level2Cards,
  ...level3Cards,
  ...level4Cards,
  ...level5Cards,
  ...bossCards,
  ...characterCards
];

// Function to get a random selection of cards for a hand
export const getRandomHand = (count: number = 5): Card[] => {
  const commonCards = [
    ...level1Cards,
    ...level2Cards,
    ...level3Cards,
    ...level4Cards,
    ...level5Cards
  ];
  const hand: Card[] = [];

  // Create a copy of the array to avoid modifying the original
  const cardPool = [...commonCards];

  for (let i = 0; i < count; i++) {
    if (cardPool.length === 0) break;

    const randomIndex = Math.floor(Math.random() * cardPool.length);
    const selectedCard = cardPool[randomIndex];

    // Add the card to hand and remove from pool to avoid duplicates
    hand.push({ ...selectedCard, id: generateCardId() });
    cardPool.splice(randomIndex, 1);
  }

  return hand;
};
