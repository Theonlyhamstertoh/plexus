import { nanoid } from "nanoid";
export default class Coord {
  readonly y: number;
  readonly x: number;
  readonly id: string = nanoid();
  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }
}

// y = row
// x = column
