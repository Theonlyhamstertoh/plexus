import Coord from "../classes/Coord";

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
  length: BoardLength;
}

export const MARKS = {
  WATER: "~",
  EDIT: "@",
  SHIP: "s",
  MISS_HIT: "o",
  HIT: "x",
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
