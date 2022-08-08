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

export const boardSize = {
  small: [10, 10],
  medium: [10, 20],
  big: [15, 20],
  massive: [15, 25],
};
export type BoardSizeOptions = keyof typeof boardSize;
export type DeckOfFive = [Ship, Ship, Ship, Ship, Ship];
export type DeckOfFour = [Ship, Ship, Ship, Ship];
