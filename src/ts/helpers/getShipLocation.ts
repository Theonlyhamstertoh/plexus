import { Directions, ShipPositions } from "../types/types";
import { Coord } from "./matrixValidator";

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

export function getShipDirection(positions: Coord[]): Directions {
  return positions[1].x - positions[0].x === 1 ? "right" : "down";
}

export function flipShipDirection(positions: Coord[]): Directions {
  return positions[1].x - positions[0].x === 1 ? "down" : "right";
}
