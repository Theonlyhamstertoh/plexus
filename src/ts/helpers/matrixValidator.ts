import { Coord } from "../classes/Coord";
import { CoordLocations, Directions, Grid } from "../types/types";
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

export function checkPositionsIfValid(direction: Directions, coord: Coord, length: number, grid: Grid): boolean {
  // check validity of positions by seeing if it fits inside grid.
  // if it does not fit, the function returns
  const isWithinBorder = checkFit(coord, length, direction, grid);
  if (isWithinBorder === false) return false;

  // determine the ship's location data
  const coordLocation = coordLocationData(coord, length, grid);

  // create a representative name to simplify code
  const checkArea = direction === "right" ? rowsToCheck : columnsToCheck;
  // By using Array.Every, if only one of them return false, then there is no valid position
  return checkArea(coordLocation, coord).every(({ y, x }: Coord) => {
    for (let i = 0; i < getAreaLength(coordLocation, length); i++) {
      if (direction === "right" && grid[y][x + i] === "s") return false;
      if (direction === "down" && grid[y + i][x] === "s") return false;
    }
    return true;
  });
}

export function getAreaLength({ isNormal }: CoordLocations, length: number): number {
  return isNormal ? length + 2 : length + 1;
}
export function checkFit(coord: Coord, length: number, direction: Directions, grid: Grid) {
  const { x, y } = coord;
  // grid starts at [0, 0], not [1, 1], thus substract 1 to get coord limits
  const yMax = grid.length - 1;
  const xMax = grid[0].length - 1;
  if (x < 0 || y < 0) return false;
  if (direction === "down") {
    const shipLastCoord = new Coord(y + (length - 1), x);
    if (shipLastCoord.x > xMax) return false;
    // If the last row number (yMax) >= 0, then it is within border.
    // If not, then it does not fit inside border
    return yMax - shipLastCoord.y >= 0 ? true : false;
  } else if (direction === "right") {
    const shipLastCoord = new Coord(y, x + (length - 1));
    if (shipLastCoord.y > yMax) return false;
    return 0 <= shipLastCoord.x && shipLastCoord.x <= xMax ? true : false;
  }
}

export const coordLocationData = (coord: Coord, length: number, grid: Grid): CoordLocations => {
  const yMax = grid.length;
  const xMax = grid[0].length;

  const isFirstColumn = coord.x === 0;
  const isFirstRow = coord.y === 0;
  const isLastRow = coord.y === yMax - 1;
  const isLastColumn = coord.x === xMax - 1;

  const isNormal = isLastRow === false && isFirstRow === false && isFirstColumn === false && isLastColumn === false;

  return {
    isFirstColumn,
    isFirstRow,
    isLastRow,
    isLastColumn,
    isNormal,
  };
};

// get the rows to check based on the Coord
// the Coord passed in has to be validated to fit inside grid. The function will not be able to determine if it does not fit.
export function rowsToCheck(coordLocation: CoordLocations, coord: Coord): Coord[] {
  // if the Coord......
  const { isFirstColumn, isFirstRow, isLastRow } = coordLocation;

  // imagine a grid where the top left is [0, 0]
  // Up   === negative | down  === positive
  // left === negative | right === positive
  // we need to find adjacent coord positions to find which rows to check
  const coordDown = new Coord(coord.y + 1, coord.x);
  const coordTop = new Coord(coord.y - 1, coord.x);
  const coordLeft = new Coord(coord.y, coord.x - 1);
  const coordTopLeft = new Coord(coord.y - 1, coord.x - 1);
  const coordDownLeft = new Coord(coord.y + 1, coord.x - 1);

  // no check for lastColumn because ship would never fit
  // checks top left corner border
  if (isFirstColumn && isFirstRow) return [coord, coordDown];
  // check bottom left corner border
  if (isFirstColumn && isLastRow) return [coordTop, coord];
  // checks top border coords after first column
  if (isFirstRow && !isFirstColumn) return [coordLeft, coordDownLeft];
  // checks left border coords that are after first row
  if (isFirstColumn && !isFirstRow && !isLastRow) return [coordTop, coord, coordDown];
  // check bottom border after first column
  if (isLastRow && !isFirstColumn) return [coordTopLeft, coordLeft];

  // if it is not adjacent to any border! If it is normal
  return [coordTopLeft, coordLeft, coordDownLeft];
}

/**
 *
 * When direction is down, it will be the left, middle, and right columns.
 * Gather these columns and validate it based on Coord
 *
 */

export function columnsToCheck(coordLocation: CoordLocations, coord: Coord): Coord[] {
  // if the Coord......
  const { isFirstColumn, isFirstRow, isLastColumn, isLastRow } = coordLocation;

  const coordTop = new Coord(coord.y - 1, coord.x);
  const coordTopLeft = new Coord(coord.y - 1, coord.x - 1);
  const coordTopRight = new Coord(coord.y - 1, coord.x + 1);
  const coordLeft = new Coord(coord.y, coord.x - 1);
  const coordRight = new Coord(coord.y, coord.x + 1);

  // there is no check for last row because ship would never pass fit check if down
  // checks top left corner border
  if (isFirstRow && isFirstColumn) return [coord, coordRight];
  // check top right corner border
  if (isFirstRow && isLastColumn) return [coordLeft, coord];
  // checks top border coords that are between first and last column
  if (isFirstRow && !isFirstColumn && !isLastColumn) return [coordLeft, coord, coordRight];
  // checks left border coords that are after first row
  if (isFirstColumn && !isFirstRow) return [coordTop, coordTopRight];
  // check right border coords that are after first row
  if (isLastColumn && !isFirstRow) return [coordTopLeft, coordTop];

  // if not restraint by any border, start check from one row above
  return [coordTopLeft, coordTop, coordTopRight];
}
