import Coord from "../classes/Coord";
import Ship from "../classes/Ship";

export type Directions = "down" | "right";
export type Grid = string[][];
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
export interface GameBoardParams {
  boardLength: BoardLength;
}

export const MARKS = {
  WATER: "🟦",
  EDIT: "@",
  SHIP: "🌕",
  destroyed: "🔴",
  MISS_HIT: "⬜",
  HIT: "❌",
};

const gameMode = {
  spectate: "spectate",
  disconnected: "disconnected",
  alive: "alive",
};

export const modeTypes = {
  edit: "@",
  show: "s",
  clear: "~",
};
export type Mode = keyof typeof modeTypes;

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

export type BoardSizeOptions = keyof typeof BOARD_SIZE;
// export type AttackCoordData = { coord: Coord; hit: boolean };
