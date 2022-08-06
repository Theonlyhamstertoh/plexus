import { nanoid } from "nanoid";
import Ship from "./Ship";

export class Player {
  readonly id: string = nanoid();
  readonly name: string;
  ships: Ship[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addShip(ship: Ship) {
    this.ships.push(ship);
  }

  removeShip(ship: Ship) {
    this.ships.find((s, i) => s.id === ship.id && this.ships.splice(i, 1));
  }
}
