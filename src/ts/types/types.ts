export type Directions = "down" | "right";

export interface CoordLocations {
  isFirstColumn: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  areaLengthToCheck: number;
  coord: number;
}
