import { Coord } from "../classes/Coord";

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

export type ShipPositions = { x: number; y: number }[];
