import { Coord } from "../helpers/matrixValidator";

export type Directions = "down" | "right";
export type Grid = string[][];
export interface CoordLocations {
  isFirstColumn: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  coord: Coord;
}

export type BoardLength = [number, number];
export interface GameBoardParams {
  length: BoardLength;
}

export type ShipPositions = { x: number; y: number }[];
