import { nanoid } from "nanoid";
import { createDefaultShips, getRandomCoord } from "../helpers/shipUtilities";
import { Directions, MARKS } from "../types/types";
import Coord from "./Coord";
import Gameboard from "./Gameboard";
import Ship from "./Ship";

export class Entity {
  ships: Ship[] = createDefaultShips();
  readonly id: string = nanoid();
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  addShip(ship: Ship) {
    this.ships.push(ship);
  }

  removeShip(ship: Ship) {
    this.ships.find((s, i) => s.id === ship.id && this.ships.splice(i, 1));
  }

  getAliveShipCount() {
    return this.ships.filter((ship) => ship.isDestroyed === false);
  }

  getDestroyedShipCount() {
    return this.ships.filter((ship) => ship.isDestroyed === true);
  }

  isReady() {
    return this.ships.every((ship) => ship.placed === true);
  }
}

export default class Player extends Entity {
  constructor(name: string) {
    super(name);
  }

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: Coord) {
    if (coord === undefined) throw Error("UNDEFINED ATTACK COORD");
    const isHit = opponentBoard.receiveAttack(coord);
    return { coord, hit: isHit };
  }
}

export class AI extends Entity {
  constructor(name: string) {
    super(name);
  }

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: Coord) {
    const possibleAttacks = this.getPossibleAttacks(opponentBoard);
    if (possibleAttacks === undefined) return this.attackRandom(opponentBoard);
    const attackCoord = possibleAttacks[getRandomCoord(possibleAttacks.length)];
    const isHit = opponentBoard.receiveAttack(attackCoord);
    return { coord: attackCoord, hit: isHit };
  }

  attackRandom(opponentBoard: Gameboard) {
    // attack randomly in positions not yet attacked
    do {
      const coordY = getRandomCoord(opponentBoard.length[0]);
      const coordX = getRandomCoord(opponentBoard.length[1]);
      const attackCoord: Coord = new Coord(coordY, coordX);

      const gridTile = opponentBoard.grid[coordY][coordX];
      // if already hit, cycle to next one
      if (gridTile !== MARKS.HIT && gridTile !== MARKS.MISS_HIT) {
        const isHit = opponentBoard.receiveAttack(attackCoord);
        return { coord: attackCoord, hit: isHit };
      }
    } while (true);
  }
  getPossibleAttacks(opponentBoard: Gameboard) {
    const { hits } = opponentBoard.getBoardState();
    if (hits.length === 0) return;
    if (hits.length === 1) {
      // we randomly hit a spot. Now, find the possible spots within area
      const coord: Coord = hits[0];
      const coordDown = new Coord(coord.y + 1, coord.x);
      const coordTop = new Coord(coord.y - 1, coord.x);
      const coordLeft = new Coord(coord.y, coord.x - 1);
      const coordRight = new Coord(coord.y, coord.x + 1);

      return [coordDown, coordTop, coordLeft, coordRight];
    }

    if (hits.length >= 2) {
      return getAttacksInDirection(hits, opponentBoard.length);
    }
  }
}

export function getAttacksInDirection(hits: Coord[], maxLength: [number, number]): Coord[] {
  const yDifference = hits[1].y - hits[0].y;
  const direction: Directions = yDifference !== 0 ? "down" : "right";

  const sortedHits = sortHitsAcsending(hits);
  // direction will tell us which coords to check
  const firstCoord = sortedHits[0];
  const lastCoord = sortedHits[sortedHits.length - 1];
  const yMax = maxLength[0] - 1;
  const xMax = maxLength[1] - 1;
  let attackCoords = [];
  if (direction === "down") {
    const coordOne = new Coord(firstCoord.y - 1, firstCoord.x);
    const coordTwo = new Coord(lastCoord.y + 1, firstCoord.x);

    attackCoords.push(firstCoord.y > 0 ? coordOne : null, lastCoord.y < yMax ? coordTwo : null);
  } else if (direction === "right") {
    const coordOne = new Coord(firstCoord.y, firstCoord.x - 1);
    const coordTwo = new Coord(firstCoord.y, lastCoord.x + 1);
    attackCoords.push(firstCoord.x > 0 ? coordOne : null, lastCoord.x < xMax ? coordTwo : null);
  }
  return attackCoords.flatMap((coord) => (coord !== null ? [coord] : []));
}
// check if the possible attack is outside of grid

export function sortHitsAcsending(hits: Coord[]) {
  const yDifference = hits[1].y - hits[0].y;
  const axis = yDifference !== 0 ? "y" : "x";
  return hits.sort((a: Coord, b: Coord): number => a[axis] - b[axis]);
}

export function sortOnlyValidAttacks(attacks: Coord[]) {
  return attacks.filter((coord) => coord !== null);
}
export const getAxis = (direction: Directions) => (direction === "right" ? "x" : "y");

// if ship is hit three times or more, I need to get the position but they have to be the very last or very first. To do this, I should use a reduce

// if there are any hit tiles, and ship has not been fully destroyed, keep on trying.
// what is the easiest way to tell a bot that a ship has been destroyed? Changing it to a destroyed sign

// if bot1 randomly hits a ship
// the next player, bot2, should know what coord bot1 hits
// bot2 will gather possible areas to hit from it
// bot2 will attack randomly one of them
// if hit, there will be two coords to pass down to bot3
// bot3 will gather possible coords in one direction
// bo3 will randomly choose the end or bottom
// if hit, bot4 does the same. Keeps on trying until the ship is completely destroyed.
