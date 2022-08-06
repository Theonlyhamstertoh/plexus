import { Coord } from "../classes/Coord";
import { Directions, ShipPositions } from "../types/types";

export function createShipPositions(direction: Directions, { y, x }: Coord, length: number): Coord[] {
  let pos: Coord[] = [];
  for (let i = 0; i < length; i++) {
    if (direction === "down") pos.push(new Coord(y + i, x));
    if (direction === "right") pos.push(new Coord(y, x + i));
  }

  return pos;
}

export function getShipDirection(positions: Coord[]): Directions {
  return positions[1].x - positions[0].x === 1 ? "right" : "down";
}

export function flipShipDirection(positions: Coord[]): Directions {
  return positions[1].x - positions[0].x === 1 ? "down" : "right";
}
