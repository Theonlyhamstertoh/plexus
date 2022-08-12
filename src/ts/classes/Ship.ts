import { nanoid } from "nanoid";
import Coord from "./Coord";

export default class Ship {
  readonly length: number;
  readonly id: string = nanoid();
  positions: Coord[] = [];
  damagedPosIndex: number[] = [];
  #lives: number;
  isDestroyed: boolean = false;
  placed: boolean = false;
  constructor(length: number) {
    this.#lives = this.length = length;
  }

  isDamaged() {
    return this.#lives !== 0 && this.#lives < this.length;
  }

  // markCoordHit({ y, x }: Coord) {
  //   this.positions.find((pos: Coord) => {
  //     if (pos.y === y && pos.x === x) {
  //     }
  //   });
  // }

  isHit(coord: Coord) {
    if (this.#lives > 0) {
      this.#lives--;

      // this.positions.indexOf(coord);
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
