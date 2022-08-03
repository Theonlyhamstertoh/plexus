import { CoordLocations, Directions } from "../types/types";

/**
 *  USING INDEX VALUES, NOT ORDER PAIRS. ORDER PAIRS USED IN BOARD
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
 *
 */

export function checkPositionsIfValid(
  direction: Directions,
  coord: number,
  length: number,
  grid: string[]
): boolean {
  // check validity of positions by seeing if it fits inside grid.
  // if it does not fit, the function returns
  const coordFit = checkFit(coord, length, direction);
  if (coordFit === false) return false;

  // create a common name to represent to simplify
  const areaDirectionToCheck = direction === "right" ? getRightRowsToCheck : getColDownToCheck;

  // determine the ship's location data
  const coordLocation = coordLocationData(coord, length);
  // By using Array.Every, if only one of them return false, then there is no valid position
  const isValidPosition = areaDirectionToCheck(coordLocation).every((coordToCheck) => {
    for (let i = 0; i < coordLocation.areaLengthToCheck; i++) {
      if (direction === "right" && grid[coordToCheck + i] === "s") return false;
      if (direction === "down" && grid[coordToCheck + i * 10] === "s") return false;
      // const [row, col] = convertCoordToMatrix(coordToCheck);
      // if (direction === "right" && grid[row][col + i] === "s") return false;
      // if (direction === "down" && grid[row + i * 10][col] === "s") return false;

      // if it doesn't contain "s", then it is a valid coordinate
      return true;
    }
  });
  return isValidPosition;
}

export function checkFit(
  coord: number,
  length: number,
  direction: Directions
): boolean | undefined {
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
    const maxRowCoord = Math.ceil((coord + 1) / 10) * 10 - 1;
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
    coord,
  };
};

// get the rows to check based on the coordinate
// the coordinate passed in has to be validated to fit inside grid. The function will not be able to determine if it does not fit.
export function getRightRowsToCheck(coordLocation: CoordLocations): number[] {
  // if the coordinate......
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
 * Gather these columns and validate it based on coordinate
 *
 */

export function getColDownToCheck(coordLocation: CoordLocations): number[] {
  // if the coordinate......
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
