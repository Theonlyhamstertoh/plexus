import Coord from "../classes/Coord";
import Player from "../classes/Player";

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
  id: string;
  coord: Coord;
  y: number;
  x: number;
  color?: string;
  hover?: boolean;
  hit?: boolean;
  state?: string;
  fill?: string;
  stroke?: string;
}

export type GuideTypes = { length: number; isAlphabet: boolean };

export const COLORS = {
  water: "#211f9e",
  ship: "#d6bb36",
  hover: "#ab4ceb",
  attack: "#ff3333",
};

// export const PLAYER_COLORS = {
//   green: "#70B550",
//   teal: "#62E3CC",
//   red: "#C53A3A",
//   yellow_orange: "#FEC24F",
//   orange: "#ED7A39",
//   purple: "#9B4FFE",
//   pink: "#E939EA",
//   blue: "#4765B4",
// };

export const PLAYER_COLORS = [
  "#c49f60",
  "#70B550",
  "#62E3CC",
  "#d64949",
  "#FEC24F",
  "#ED7A39",
  "#9B4FFE",
  "#E939EA",
  "#5969d4",
  "#e4e0d8",
];

export const DEFAULT_TILE_FILL = "#353535";
export const DEFAULT_TILE_STROKE = "#3c3c3c";
export interface ShipPiece {
  color: string;
  length: number;
  y: number;
}

export type PlayersParam = { players: Player[] };
