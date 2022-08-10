import { nanoid } from "nanoid";
import { createRandomShips, getRandomCoord } from "../helpers/shipUtilities";
import { CONFIG } from "../types/types";
import Coord from "./Coord";
import Gameboard from "./Gameboard";
import Ship from "./Ship";

function createDefaultShips() {
  return [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];
}

export default class Player {
  readonly id: string = nanoid();
  readonly name: string;
  attack: Function;
  ships: Ship[] = createDefaultShips();

  constructor(name: string, isBot = false) {
    this.name = name;
    this.attack = isBot ? botAttack : playerAttack;
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

function botAttack(opponentBoard: Gameboard) {
  // get a random coord
  const coordY = getRandomCoord(CONFIG.boardLength[0]);
  const coordX = getRandomCoord(CONFIG.boardLength[1]);
  const attackCoord: Coord = new Coord(coordY, coordX);

  opponentBoard.receiveAttack(attackCoord);
  // attack the coordinate
}

function playerAttack(opponentBoard: Gameboard, coord: Coord) {
  // opponentBoard.receiveAttack(coord);
}
