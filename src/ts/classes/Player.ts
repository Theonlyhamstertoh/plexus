import { nanoid } from "nanoid";
import { createRandomShips, getRandomCoord } from "../helpers/shipUtilities";
import { CONFIG, MARKS } from "../types/types";
import Coord from "./Coord";
import Gameboard from "./Gameboard";
import Ship from "./Ship";

function createDefaultShips() {
  return [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];
}

export default class Player {
  readonly id: string = nanoid();
  readonly name: string;
  readonly isBot: boolean;
  ships: Ship[] = createDefaultShips();

  constructor(name: string, isBot = false) {
    this.name = name;
    this.isBot = isBot;
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

  computerAttack(opponentBoard: Gameboard) {
    // get a random coord
    do {
      const coordY = getRandomCoord(opponentBoard.length[0]);
      const coordX = getRandomCoord(opponentBoard.length[1]);
      const attackCoord: Coord = new Coord(coordY, coordX);

      const gridTile = opponentBoard.grid[coordY][coordX];
      if (gridTile !== MARKS.HIT && gridTile !== MARKS.MISS_HIT) {
        const isHit = opponentBoard.receiveAttack(attackCoord);
        return { coord: attackCoord, hit: isHit };
      }
    } while (true);
  }

  attack(opponentBoard: Gameboard, coord: Coord) {
    const isHit = opponentBoard.receiveAttack(coord);
    return { coord, hit: isHit };
  }
}
