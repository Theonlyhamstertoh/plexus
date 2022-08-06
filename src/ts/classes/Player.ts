import { nanoid } from "nanoid";
import Ship from "./Ship";

const TEST_SHIPS = [new Ship(4), new Ship(3), new Ship(5), new Ship(3), new Ship(2)];
export class Player {
  readonly id: string = nanoid();
  readonly name: string;
  ships: Ship[] = TEST_SHIPS;

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
