import { nanoid } from "nanoid";
import { createDefaultShips, getRandomNumber } from "../helpers/shipUtilities";
import { Directions, Grid, MARKS } from "../types/types";
import Coord from "./Coord";
import Gameboard from "./Gameboard";
import Ship from "./Ship";

export default class Entity {
  ships: Ship[] = createDefaultShips();
  readonly id: string = nanoid();
  readonly name: string;
  readonly color: string = "#ab4ceb";
  constructor(name: string) {
    this.name = name;
  }
  addShip(...ship: Ship[]) {
    this.ships.push(...ship);
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
