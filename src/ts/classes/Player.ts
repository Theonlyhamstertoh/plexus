import { nanoid } from "nanoid";
import { createDefaultShips, getRandomCoord } from "../helpers/shipUtilities";
import { MARKS } from "../types/types";
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
    const { shipHit } = opponentBoard.getBoardState();
    if (shipHit.length === 0) return;
    if (shipHit.length === 1) {
      // we randomly hit a spot. Now, find the possible spots within area
      const coord: Coord = shipHit[0];
      const coordDown = new Coord(coord.y + 1, coord.x);
      const coordTop = new Coord(coord.y - 1, coord.x);
      const coordLeft = new Coord(coord.y, coord.x - 1);
      const coordRight = new Coord(coord.y, coord.x + 1);

      return [coordDown, coordTop, coordLeft, coordRight];
    }

    if (shipHit.length === 2) {
    }
  }
}
// maybe a array that says coords that hit a ship
// is a ship hit. If it is a bot, if there is any ship hit
// then it will immediately focus on KOing that one first
// shipHit should return me the ship
// also need the coord that hit it?
// say there is one ship in there
// what fucking coordinate is it
// if previous coordinate hit, your teammate (another bot) goes
// so that coordinate must be shared for bots
// maybe each ship if hit, stores the hit coord somewhere

export function getAttacksInDirection(shipHit: Coord[]) {
  const yDifference = shipHit[1].y - shipHit[0].y;
  const xDifference = shipHit[1].x - shipHit[0].x;
  const direction = yDifference !== 0 ? "down" : "right";

  // direction will tell us which coords to check
  if (direction === "down") {
    // if yDifference is +1, then [1] is on bottom. By adding the yDifference [1], it will give me the next row. If -1, then adding that will give me the previous row.
    // because the [0] subtracts, it will be the opposite of whatever the ydifference is. If yDifference is -1, then [0] is the bottom. The negatives cancel out and we can get the next row.

    const coordOne = new Coord(shipHit[1].y + yDifference, shipHit[1].x);
    const coordTwo = new Coord(shipHit[0].y - yDifference, shipHit[0].x);
    return [coordOne, coordTwo];
  } else if (direction === "right") {
    const coordOne = new Coord(shipHit[1].y, shipHit[1].x + xDifference);
    const coordTwo = new Coord(shipHit[0].y, shipHit[0].x - xDifference);
    return [coordOne, coordTwo];
  }
}

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
