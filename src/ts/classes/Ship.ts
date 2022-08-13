import { nanoid } from "nanoid";
import Coord from "./Coord";

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

  isHit(coord: Coord) {
    if (this.#lives > 0) {
      this.#lives--;
      this.hits.push(coord);
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
