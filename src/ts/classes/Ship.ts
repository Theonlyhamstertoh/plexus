export default class Ship {
  readonly length: number;
  positions: number[] = [];
  #lives: number;
  isDestroyed: boolean = false;
  constructor(length: number, positions: number[]) {
    this.#lives = this.length = length;
    this.positions = positions;
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
