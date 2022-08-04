import { CoordLocations, Directions } from "../types/types";

// y = row
// x = column

type Grid = string[][];
export class Coord {
  readonly y: number;
  readonly x: number;
  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }
}
export function getPositionsFromCoord(
  direction: Directions,
  { y, x }: Coord,
  length: number
): Coord[] {
  let pos: Coord[] = [];
  for (let i = 0; i < length; i++) {
    if (direction === "down") pos.push(new Coord(y + i, x));
    if (direction === "right") pos.push(new Coord(y, x + i));
  }

  return pos;
}

/**
 *  USING INDEX VALUES, NOT ORDER PAIRS. ORDER PAIRS USED IN BOARD
 *
 *  The positions of the ship, given by the first Coord,
 *  are validated by scanning the three rows: top, middle (the ship),
 *  and bottom to see if there already ships there.
 *
 *  The rows are determined by finding the left most adjacent collum
 *  (if right), or top most adjacent collum (if down), and incrementing
 *  each Coord in the three rows until all the adjacent Coords
 *  in the area of the ship are clear.
 *
 *  TOP ROW:     --------
 *  MIDDLE ROW:  --SHIP--
 *  BOTTOM ROW:  --------
 *
 *
 */

export function checkPositionsIfValid(
  direction: Directions,
  coord: Coord,
  length: number,
  grid: Grid
): boolean {
  // check validity of positions by seeing if it fits inside grid.
  // if it does not fit, the function returns
  const coordFit = checkFit(coord, length, direction, grid);
  if (coordFit === false) return false;

  // create a common name to represent to simplify
  const areaDirectionToCheck = direction === "right" ? getRightRowsToCheck : getColDownToCheck;

  // determine the ship's location data
  const coordLocation = coordLocationData(coord, length);
  // By using Array.Every, if only one of them return false, then there is no valid position
  const isValidPosition = areaDirectionToCheck(coordLocation).every((coordToCheck) => {
    let isValid = true;
    for (let i = 0; i < coordLocation.areaLengthToCheck; i++) {
      // if (direction === "down" && grid[coordToCheck + i * 10] === "s") return (isValid = false);
      // if (direction === "right" && grid[coordToCheck + i] === "s") return (isValid = false);
      // const [row, col] = convertCoordToMatrix(coordToCheck);
      // if (direction === "right" && grid[row][col + i] === "s") return false;
      // if (direction === "down" && grid[row + i * 10][col] === "s") return false;
      // if it doesn't contain "s", then it is a valid Coord
      // return true;
    }
    return isValid;
  });
  return isValidPosition;
}

export function checkFit(coord: Coord, length: number, direction: Directions, grid: Grid) {
  const { x, y } = coord;
  const yMax = grid.length;
  const xMax = grid[0].length;
  if (y >= yMax || x >= yMax) return false;
  if (x < 0 || y < 0) return false;
  if (direction === "down") {
    const shipLastCoord = new Coord(y + (length - 1), x);
    // If the last row number (yMax) >= 0, then it is within border.
    // If not, then it does not fit inside border
    return yMax - shipLastCoord.y >= 0 ? true : false;
  } else if (direction === "right") {
    const shipLastCoord = new Coord(y, x + (length - 1));
    return 0 <= shipLastCoord.x && shipLastCoord.x <= xMax ? true : false;
  }
}

export const coordLocationData = (coord: Coord, length: number, grid: Grid) => {
  const yMax = grid.length;
  const xMax = grid[0].length;

  const isFirstColumn = coord.x === 0;
  const isFirstRow = coord.y === 0;
  const isLastRow = coord.y === yMax;
  const isLastColumn = coord.x === xMax;

  // const isNormal = isLastRow === false && isFirstRow === false && isFirstColumn === false;

  return {
    isFirstColumn,
    isFirstRow,
    isLastRow,
    isLastColumn,
    coord,
  };
};

// get the rows to check based on the Coord
// the Coord passed in has to be validated to fit inside grid. The function will not be able to determine if it does not fit.
export function getRightRowsToCheck(coordLocation: CoordLocations): number[] {
  // if the Coord......
  const { isFirstColumn, isFirstRow, isLastRow, coord } = coordLocation;

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
 * When direction is down, it will be the left, middle, and right columns.
 * Gather these columns and validate it based on Coord
 *
 */

export function getColDownToCheck(coordLocation: CoordLocations): number[] {
  // if the Coord......
  const { isFirstColumn, isFirstRow, isLastColumn, coord } = coordLocation;

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

export function convertCoordToMatrix(coord: number): [number, number] {
  const coordAsString = coord.toString();

  if (coordAsString.length === 1) {
    const col = coordAsString.charAt(0);
    return [0, parseInt(col)];
  }

  // if coord is length of 2, then do this by default.
  const row = coordAsString.charAt(0);
  const col = coord.toString().charAt(1);
  return [parseInt(row), parseInt(col)];
}

type boardLengthParams = [number, number];
interface GameBoardParams {
  boardLength: boardLengthParams;
}
export default class Gameboard {
  grid: string[][] = [];
  constructor({ boardLength }: GameBoardParams) {
    this.createBoard(boardLength);
  }

  createBoard(boardLength: boardLengthParams = [10, 10]) {
    for (let y = 0; y < boardLength[0]; y++) {
      this.grid[y] = [];
      for (let x = 0; x < boardLength[1]; x++) {
        this.grid[y][x] = "~";
      }
    }
    return this.grid;
  }

  showBoard() {
    console.log(
      this.grid.map((row) => {
        return JSON.stringify(row);
      })
    );
  }
}
