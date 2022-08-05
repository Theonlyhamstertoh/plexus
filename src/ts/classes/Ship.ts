import { Coord } from "../helpers/matrixValidator";
import { Directions, ShipPositions } from "../types/types";

export default class Ship {
  readonly length: number;
  positions: Coord[] = [];
  #lives: number;
  isDestroyed: boolean = false;
  constructor(length: number) {
    this.#lives = this.length = length;
  }

  isHit() {
    if (this.#lives > 0) {
      this.#lives--;
    }

    if (this.#lives === 0) {
      this.isDestroyed = true;
      return;
    }
  }

  get lives() {
    return this.#lives;
  }
}
