import { Directions } from "./types/types";

export function getPositionsFromCoord(direction: Directions, coord: number, length: number) {
  let pos: number[] = [];
  for (let i = 0; i < length; i++) {
    if (direction === "down") pos.push(coord + 10 * i);
    if (direction === "right") pos.push(coord + 1 * i);
  }

  return pos;
}
