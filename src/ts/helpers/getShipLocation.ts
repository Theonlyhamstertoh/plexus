import { Directions, ShipPositions } from "../types/types";
import { convertCoordToMatrix } from "./positionValidator";

export function getPositionsFromCoord(direction: Directions, coord: number, length: number) {
  let pos: number[] = [];
  for (let i = 0; i < length; i++) {
    if (direction === "down") pos.push(coord + 10 * i);
    if (direction === "right") pos.push(coord + 1 * i);
    // const [x, y] = convertCoordToMatrix(coord);
    // if (direction === "down") pos.push({ x: x + i, y });
    // if (direction === "right") pos.push({ x, y: y + i });
  }

  return pos;
}
