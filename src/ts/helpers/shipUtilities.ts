import Coord from "../classes/Coord";
import Ship from "../classes/Ship";
import { Directions } from "../types/types";

export function createShipPositions(
  direction: Directions,
  { y, x }: Coord,
  length: number
): Coord[] {
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

export function flipDirectionByCoords(positions: Coord[]): Directions {
  return positions[1].x - positions[0].x === 1 ? "down" : "right";
}
export function flipDirection(direction: string): Directions {
  return direction === "right" ? "down" : "right";
}

export const getRandomCoord = (maxLength: number) => Math.floor(Math.random() * maxLength);

export const getRandomPosition = (): Directions => {
  return !!Math.floor(Math.random() * 2) ? "right" : "down";
};

export function createRandomShips(count: number) {
  const ships = [];
  for (let i = 0; i < count; i++) {
    const size = Math.floor(Math.random() * 4) + 2;
    ships.push(new Ship(size));
  }
  return ships;
}
