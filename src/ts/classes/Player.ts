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
  constructor(name: string, AI: boolean = false) {
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

  // if there are any hit tiles, and ship has not been fully destroyed, keep on trying.
  // what is the easiest way to tell a bot that a ship has been destroyed? Changing it to a destroyed sign
}
