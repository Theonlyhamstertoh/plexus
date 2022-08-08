import { nanoid } from "nanoid";
import Coord from "./Coord";
import Ship from "./Ship";

const DEFAULT_SHIPS = [new Ship(5), new Ship(4), new Ship(3), new Ship(3), new Ship(2)];

export default class Player {
  readonly id: string = nanoid();
  readonly name: string;
  attack: Function;
  ships: Ship[] = DEFAULT_SHIPS;

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
}

function botAttack() {}

function playerAttack(coord: Coord) {
  return new Coord(2, 2);
}
