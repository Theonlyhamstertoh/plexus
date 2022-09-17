import { nanoid } from "nanoid";
import Coord from "./Coord.js";

export default class Ship {
  readonly length: number;
  readonly id: string = nanoid();
  positions: Coord[] = [];
  hits: Coord[] = [];
  #lives: number;
  isDestroyed: boolean = false;
  placed: boolean = false;
  constructor(length: number) {
    this.#lives = this.length = length;
  }

  isDamaged() {
    return this.#lives !== 0 && this.#lives < this.length;
  }

  isHit(coord?: Coord) {
    if (this.#lives > 0) {
      this.#lives--;
      // this.hits.push(coord);

      // move hit coords from position to hits array
      if (coord !== undefined) {
        const coordIndex = this.positions.findIndex((c) => c.y === coord.y && c.x === coord.x);
        this.hits.push(...this.positions.slice(coordIndex, coordIndex + 1));
      }
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
