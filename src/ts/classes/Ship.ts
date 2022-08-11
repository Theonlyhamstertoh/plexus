import { nanoid } from "nanoid";
import Coord from "./Coord";

export default class Ship {
  readonly length: number;
  readonly id: string = nanoid();
  positions: Coord[] = [];
  #lives: number;
  isDestroyed: boolean = false;
  placed: boolean = false;
  constructor(length: number) {
    this.#lives = this.length = length;
  }

  isDamaged() {
    return this.#lives < this.length;
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
