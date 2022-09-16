import { getRandomNumber } from "../helpers/shipUtilities.js";
import { Directions, Grid, MARKS } from "../types/types.js";
import Coord from "./Coord.js";
import Entity from "./Entity.js";
import Gameboard from "./Gameboard.js";

export default class AI extends Entity {
  constructor(name: string) {
    super(name);
  }

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: any): boolean {
    if (opponentBoard.notHitCoords.length === 0) return false;
    const possibleAttacks = this.getPossibleAttacks(opponentBoard);
    // if there are no attacks so far that hit
    if (possibleAttacks === undefined) return this.attackRandom(opponentBoard);

    // randomly choose a attack coord within array
    const attackCoord = possibleAttacks[getRandomNumber(possibleAttacks.length)];
    return opponentBoard.receiveAttack(attackCoord);
  }

  attackRandom(opponentBoard: Gameboard): boolean {
    // attack randomly in positions not yet attacked
    const index = getRandomNumber(opponentBoard.notHitCoords.length);
    const attackCoord: Coord = opponentBoard.notHitCoords[index];

    return opponentBoard.receiveAttack(attackCoord);
  }
  getPossibleAttacks(opponentBoard: Gameboard) {
    // const hits = opponentBoard.hits;
    const { hits } = opponentBoard.getBoardState();
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
  const attackCoords = [coordDown, coordTop, coordLeft, coordRight];
  // filter out coordinates that is out of bound or already hit before
  return attackCoords.filter((c: Coord) => attackCoordCondition(c, grid));
}

export function getAttacksInDirection(hits: Coord[], grid: Grid): Coord[] {
  const yDifference = hits[1].y - hits[0].y;
  // direction will tell us which axis to search
  const direction: Directions = yDifference !== 0 ? "down" : "right";

  const sortedHits = sortHitsAcsending(hits);
  const firstCoord = sortedHits[0];
  const lastCoord = sortedHits[sortedHits.length - 1];
  const attackCoords = [];
  if (direction === "down") {
    const coordOne = new Coord(firstCoord.y - 1, firstCoord.x);
    const coordTwo = new Coord(lastCoord.y + 1, firstCoord.x);
    attackCoords.push(coordOne, coordTwo);
  } else if (direction === "right") {
    const coordOne = new Coord(firstCoord.y, firstCoord.x - 1);
    const coordTwo = new Coord(firstCoord.y, lastCoord.x + 1);
    attackCoords.push(coordOne, coordTwo);
  }
  // filter out coordinates that is out of bound or already hit before
  return attackCoords.filter((c) => attackCoordCondition(c, grid));
}

export function sortHitsAcsending(hits: Coord[]) {
  const yDifference = hits[1].y - hits[0].y;
  const axis = yDifference !== 0 ? "y" : "x";
  return hits.sort((a: Coord, b: Coord): number => a[axis] - b[axis]);
}

export const attackCoordCondition = (coord: Coord, grid: Grid) => {
  const yMax = grid.length;
  const xMax = grid[0].length;
  return (
    coord.x >= 0 &&
    coord.x < xMax &&
    coord.y >= 0 &&
    coord.y < yMax &&
    grid[coord.y][coord.x] !== MARKS.HIT &&
    grid[coord.y][coord.x] !== MARKS.MISS_HIT
  );
};

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
