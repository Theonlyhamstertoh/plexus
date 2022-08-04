import { Coord } from "../helpers/matrixValidator";

export type Directions = "down" | "right";

export interface CoordLocations {
  isFirstColumn: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  coord: Coord;
  areaLength: number;
}

export type ShipPositions = { x: number; y: number }[];
