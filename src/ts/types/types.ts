import Coord from "../classes/Coord";

export type Directions = "down" | "right";
export type Grid = MarkSymbols[][];
export interface CoordLocations {
  isFirstColumn: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  yMax: number;
  xMax: number;
  coord: Coord;
}

export type BoardLength = [number, number];

export const MARKS = {
  WATER: "🟦",
  EDIT: "@",
  SHIP: "🌕",
  destroyed: "🔴",
  MISS_HIT: "⬜",
  HIT: "❌",
} as const;

export type MarkTypes = keyof typeof MARKS;
export type MarkSymbols = typeof MARKS[MarkTypes];
const gameMode = {
  spectate: "spectate",
  disconnected: "disconnected",
  alive: "alive",
};

export const BOARD_SIZE: BoardSizes = {
  SMALL: [10, 10],
  MEDIUM: [10, 20],
  BIG: [15, 20],
  LARGE: [15, 25],
};

interface BoardSizes {
  SMALL: BoardLength;
  MEDIUM: BoardLength;
  BIG: BoardLength;
  LARGE: BoardLength;
}
export type BoardSizeOptions = keyof typeof BOARD_SIZE;

export const CONFIG = {
  randomShips: false,
  boardLength: BOARD_SIZE.SMALL,
  shufflePlayerOrder: false,
  randomizeFirstTurn: false,
};

export interface GameConfigs {
  boardLength: BoardLength;
  randomShips?: boolean;
  shufflePlayerOrder?: boolean;
  randomizeFirstTurn?: boolean;
}

// game
export interface TileData {
  y: number;
  x: number;
  color: string;
  hover: boolean;
  hit: boolean;
  state: string;
  coord: Coord;
  id: string;
}

export const COLORS = {
  water: "#211f9e",
  ship: "#d6bb36",
  hover: "#ab4ceb",
  attack: "#ff3333",
};
