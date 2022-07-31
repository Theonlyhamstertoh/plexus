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

// should the coords be in the Ship class?
// There should be a function that inputs the rest of array from one index. Generate it based on the ship length.

type Directions = "down" | "right";
export function positionsFromCoord(direction: Directions, coord: number, length: number) {
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
  direction: Directions,
  coord: number,
  length: number
  // grid: string[]
) {
  let isNotValid = false;

  // check validity of positions by seeing if it fits inside grid.
  // if it does not, the function returns
  const coordFit = checkFit(coord, length, direction);
  if (coordFit === false) return false;

  // determine the ship's location data
  const coordLocation = coordLocationData(coord, length);

  if (direction === "right") {
    const rowsToCheck = rowsToCheckIfFacingRight(coord, coordLocation);
    rowsToCheck.forEach((row) => {
      // check each row | column to see if there is already a ship
      for (let i = 0; i < coordLocation.areaLengthToCheck; i++) {
        if (grid[row + i] === "s") return (isNotValid = true);
      }
    });
    return rowsToCheck;
  }

  // find all coordinates surrounding it
  // first find side
  // then find corners
  // then top
}

export function checkFit(coord: number, length: number, direction: Directions) {
  if (direction === "down") {
    const lastCoordDown = (length - 1) * 10 + coord;

    // By rounding it down to single digits, it makes checking for fit much easier because we don't have to check for double digits and it represents the row the last coordinate is in.
    // ex. 89 -> 8 || 99 -> 9
    // Because 9 is the last row, if the last coordinate is bigger than 9, then it is invalid. If it is smaller than 9, then it fits inside grid.
    const roundToRowNumber = Math.floor(lastCoordDown / 10);
    return 9 - roundToRowNumber >= 0 ? true : false;
  } else if (direction === "right") {
    const lastCoordRight = coord + (length - 1);
    // ex. 12 -> 20
    const maxRowCoord = Math.ceil(coord / 10) * 10 - 1;
    // ex. 12 -> 10
    const minRowCoord = Math.floor(coord / 10) * 10;

    // return true | false if it fits within min and max limits
    return minRowCoord <= lastCoordRight && lastCoordRight <= maxRowCoord ? true : false;
  }
}

export const coordLocationData = (coord: number, length: number): CoordLocations => {
  const isFirstColumn = coord % 10 === 0;
  const isFirstRow = coord < 10;
  const isLastRow = coord > 89;
  const isLastColumn = coord.toString().endsWith("9");

  // const isNormal = isLastRow === false && isFirstRow === false && isFirstColumn === false;
  const areaLengthToCheck = isFirstColumn ? length + 1 : length + 2;

  return {
    isFirstColumn,
    isFirstRow,
    isLastRow,
    isLastColumn,
    areaLengthToCheck,
  };
};
interface CoordLocations {
  isFirstColumn: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  areaLengthToCheck: number;
}

export function rowsToCheckIfFacingRight(coord: number, coordLocation: CoordLocations): number[] {
  // if the coordinate......
  const { isFirstColumn, isFirstRow, isLastRow } = coordLocation;

  // if you are 0, check middle and bottom row [FROM COORD POSITION]
  if (isFirstColumn && isFirstRow) return [coord, coord + 10];
  // if you are 90, check top and middle row [FROM COORD POSITION]
  if (isFirstColumn && isLastRow) return [coord - 10, coord];
  // if [10, 20, 30, 40, 50 , 60, 70, 80] check top, middle, and bottom row [FROM COORD POSITION]
  if (isFirstColumn) return [coord - 10, coord, coord + 10];
  // if [1-9], check middle and bottom row [FROM ONE COL LEFT]
  if (isFirstRow) return [coord - 1, coord + 9];
  // if [91 - 99], set to check top and middle row [FROM ONE COL LEFT]
  if (isLastRow) return [coord - 11, coord - 1];

  // if it is not adjacent to any border! If it is normal
  // check top, middle, and bottom row [FROM ONE COL LEFT]
  return [coord - 11, coord - 1, coord + 9];
}

/**
 *
 * When direction is down, it will be the left, middle, and right columns
 * All coordinates here should already be validated if it fits in grid
 */
export function rowsToCheckIfFacingDown(coord: number, coordLocation: CoordLocations): number[] {
  // if the coordinate......
  const { isFirstColumn, isFirstRow, isLastColumn } = coordLocation;

  // if 0, check middle and right [FROM COORD ROW]
  if (isFirstRow && isFirstColumn) return [coord, coord + 1];
  // if first row [1 - 8], check left, middle, and right column [FROM COORD ROW]
  if (isFirstRow && !isFirstColumn && !isLastColumn) return [coord - 1, coord, coord + 1];
  // if 9, check left and middle column [FROM COORD ROW]
  if (isLastColumn && isFirstRow) return [coord - 11, coord - 10];
  // if [19, 29,..., 99] check left and middle column [FROM ONE ROW UP]
  if (isLastColumn && !isFirstRow) return [coord - 11, coord - 10];
  // if first column [10,..., 80, 90], check middle and right column [FROM ONE ROW UP]
  if (isFirstColumn && isFirstRow === false) return [coord - 10, coord - 9];

  // if not restraint by any border, check left, middle, and right [FROM ONE ROW UP]
  return [coord - 11, coord - 10, coord - 9];
}

export function isNextToRightBorder(coord: number) {}

// check if the length fits the board. If not, do not place
// check when ship borders the right ship. If it does, one less length to check then.
/**
 *
 *
 */
