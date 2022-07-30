export default class Ship {
  readonly length: number;
  positions: Fixed<number> = [];
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

// should the coords be in the Ship class?
// There should be a function that inputs the rest of array from one index. Generate it based on the ship length.

type directions = "down" | "right";
export function positionsFromCoord(direction: directions, coord: number, length: number) {
  let pos: number[] = [];
  for (let i = 0; i < length; i++) {
    if (direction === "down") pos.push(coord + 10 * i);
    if (direction === "right") pos.push(coord + 1 * i);
  }
  return pos;
}

/**
 *
 *
 *  The positions of the ship, given by the first coordinate,
 *  are validated by scanning the three rows: top, middle (the ship),
 *  and bottom to see if there already ships there.
 *
 *  The rows are determined by finding the left most adjacent collum
 *  (if right), or top most adjacent collum (if down), and incrementing
 *  each coordinate in the three rows until all the adjacent coordinates
 *  in the area of the ship are clear.
 *
 *  TOP ROW:     --------
 *  MIDDLE ROW:  --SHIP--
 *  BOTTOM ROW:  --------
 *
 * @todo if(coord + length > borderLimit)
 *
 */

export function checkPositionsIfValid(
  direction: directions,
  coord: number,
  length: number,
  positions: number[]
  // grid: string[]
) {
  const adjacentCoords: number[] = [];

  let isNotValid = false;

  // determine which direction the ship is facing
  const coordLocation = coordLocationData(coord);

  if (direction === "right") {
    rowsToCheckIfFacingRight(coord, coordLocation);
    for (let i = 0; i < coordLocation.areaLengthToCheck; i++) {}
  }

  // find all coordinates surrounding it
  // first find side
  // then find corners
  // then top
}

export const coordLocationData = (coord: number): CoordLocations => {
  const isDivisibleByTen = coord % 10 === 0;
  const isFirstRow = coord < 10;
  const isLastRow = coord > 89;
  const isNormal = !isLastRow && isFirstRow && !isDivisibleByTen;
  const areaLengthToCheck = isDivisibleByTen ? length + 2 : length + 1;

  return {
    isDivisibleByTen,
    isFirstRow,
    isLastRow,
    isNormal,
    areaLengthToCheck,
  };
};
interface CoordLocations {
  isDivisibleByTen: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isNormal: boolean;
  areaLengthToCheck: number;
}

export function rowsToCheckIfFacingRight(coord: number, coordLocation: CoordLocations) {
  // if the coordinate......
  const { isDivisibleByTen, isFirstRow, isLastRow, isNormal } = coordLocation;
  const rowsToCheck = [];

  // if you are 0, check middle and bottom row [FROM CURRENT COLLUM]
  if (isDivisibleByTen && isFirstRow) return rowsToCheck.push(coord, coord + 10);
  // if you are 90, check top and middle row [FROM CURRENT COLLUM]
  if (isDivisibleByTen && isLastRow) return rowsToCheck.push(coord - 10, coord);
  // if [10, 20, 30, 40, 50 , 60, 70, 80] check top, middle, and bottom row [FROM CURRENT COLLUM]
  if (isDivisibleByTen) return rowsToCheck.push(coord - 10, coord, coord + 10);
  // if [1-9], check middle and bottom row [FROM ONE COL LEFT]
  if (isFirstRow) return rowsToCheck.push(coord - 1, coord + 9);
  // if [91 - 99], set to check top and middle row [FROM ONE COL LEFT]
  if (isLastRow) return rowsToCheck.push(coord - 11, coord - 1);

  // if it is not adjacent to any border! If it is normal
  // check top, middle, and bottom row [FROM ONE COL LEFT]
  if (isNormal) return rowsToCheck.push(coord - 11, coord - 1, coord + 9);
}

export function isNextToRightBorder(coord: number) {}

// check if the length fits the board. If not, do not place

/**
 *
 *
 */
