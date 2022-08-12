import { nanoid } from "nanoid";
import { createDefaultShips, getRandomCoord } from "../helpers/shipUtilities";
import { Directions, Grid, MARKS } from "../types/types";
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

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: any) {
    if (coord === undefined) throw Error("UNDEFINED ATTACK COORD");
    const isHit = opponentBoard.receiveAttack(coord);
    return { coord, hit: isHit };
  }
}

export class AI extends Entity {
  constructor(name: string) {
    super(name);
  }

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: any) {
    const possibleAttacks = this.getPossibleAttacks(opponentBoard);
    // if there are no attacks so far that hit
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
    // const hits = opponentBoard.hits;
    const hits = opponentBoard.getBoardState();
    if (hits.length === 0) return;
    if (hits.length === 1) {
      return getSurroundingCoords(hits[0], opponentBoard.grid);
    } else if (hits.length >= 2) {
      return getAttacksInDirection(hits, opponentBoard.grid);
    }
  }
}

export function getSurroundingCoords(coord: Coord, grid: Grid) {
  // we randomly hit a spot. Now, find the possible spots within area
  const coordDown = new Coord(coord.y + 1, coord.x);
  const coordTop = new Coord(coord.y - 1, coord.x);
  const coordLeft = new Coord(coord.y, coord.x - 1);
  const coordRight = new Coord(coord.y, coord.x + 1);

  const yMax = grid.length;
  const xMax = grid[0].length;
  return [coordDown, coordTop, coordLeft, coordRight].filter((coord: Coord): coord is Coord => {
    return (
      coord.x >= 0 &&
      coord.x < xMax &&
      coord.y >= 0 &&
      coord.y < yMax &&
      grid[coord.y][coord.x] !== MARKS.HIT &&
      grid[coord.y][coord.x] !== MARKS.MISS_HIT
    );
  });
}
export function getAttacksInDirection(hits: Coord[], grid: Grid): Coord[] {
  const yDifference = hits[1].y - hits[0].y;
  const direction: Directions = yDifference !== 0 ? "down" : "right";

  const sortedHits = sortHitsAcsending(hits);
  // direction will tell us which coords to check
  const firstCoord = sortedHits[0];
  const lastCoord = sortedHits[sortedHits.length - 1];
  const yMax = grid.length;
  const xMax = grid[0].length;
  let attackCoords = [];
  if (direction === "down") {
    const coordOne = new Coord(firstCoord.y - 1, firstCoord.x);
    const coordTwo = new Coord(lastCoord.y + 1, firstCoord.x);

    attackCoords.push(coordOne, coordTwo);
  } else if (direction === "right") {
    const coordOne = new Coord(firstCoord.y, firstCoord.x - 1);
    const coordTwo = new Coord(firstCoord.y, lastCoord.x + 1);
    attackCoords.push(coordOne, coordTwo);
  }
  // basicall
  return attackCoords.filter((coord): coord is Coord => {
    return (
      coord.x >= 0 &&
      coord.x < xMax &&
      coord.y >= 0 &&
      coord.y < yMax &&
      grid[coord.y][coord.x] !== MARKS.HIT &&
      grid[coord.y][coord.x] !== MARKS.MISS_HIT
    );
  });
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
