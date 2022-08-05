import { describe, test, beforeEach, expect, getRunningMode } from "vitest";
import Gameboard from "../classes/Gameboard";
import { createShipPositions, flipShipDirection, getShipDirection } from "../helpers/getShipLocation";
import {
  checkFit,
  checkPositionsIfValid,
  columnsToCheck,
  Coord,
  coordLocationData,
  rowsToCheck,
} from "../helpers/matrixValidator";

let gameboard: Gameboard;
beforeEach(() => {
  gameboard = new Gameboard({ length: [12, 18] });
});

describe("ship position validator", () => {
  test("function should generate an array of positions", () => {
    expect(createShipPositions("down", new Coord(3, 1), 4)).toEqual(
      // prettier-ignore
      arrayToCoords([[3, 1], [4, 1], [5, 1], [6, 1],
      ])
    );

    expect(createShipPositions("right", new Coord(1, 4), 4)).toEqual(
      // prettier-ignore
      arrayToCoords([[1, 4], [1, 5], [1, 6], [1, 7]])
    );
  });
  test("check the ship positions if it fits", () => {
    gameboard.showBoard();
    expect(checkFit(new Coord(10, 1), 3, "down", gameboard.grid)).toBe(true);
    expect(checkFit(new Coord(19, 1), 3, "right", gameboard.grid)).toBe(false);
  });

  test("gather coord location data", () => {
    const coordLocation = coordLocationData(new Coord(4, 0), 4, gameboard.grid);
    expect(coordLocation.isFirstColumn).toBe(true);
    expect(coordLocation.isLastColumn).toBe(false);
    expect(coordLocation.isLastRow).toBe(false);
  });

  test("check if position is valid", () => {
    expect(checkPositionsIfValid("right", new Coord(7, 0), 4, gameboard.grid)).toBe(true);
    expect(checkPositionsIfValid("down", new Coord(0, 0), 4, gameboard.grid)).toBe(true);
    expect(checkPositionsIfValid("down", new Coord(10, 0), 4, gameboard.grid)).toBe(false);
  });

  test("get the ship direction based on position", () => {
    const positions = createShipPositions("down", new Coord(3, 1), 4);
    expect(getShipDirection(positions)).toBe("down");
  });

  test("flip ship direction", () => {
    const positions = createShipPositions("down", new Coord(3, 1), 4);
    expect(flipShipDirection(positions)).toBe("right");
  });
});

describe("column checking coords are correctly returned", () => {
  test("get column coords for checking", () => {
    const coordLocation = coordLocationData(new Coord(3, 1), 4, gameboard.grid);
    // prettier-ignore
    const coords = arrayToCoords([[2, 0], [2, 1], [2, 2]]);
    expect(columnsToCheck(coordLocation)).toEqual(coords);
  });

  test("another column coord", () => {
    const coordLocation = coordLocationData(new Coord(0, 12), 4, gameboard.grid);
    // prettier-ignore
    const coords = arrayToCoords([[0, 11], [0, 12], [0, 13]]);
    expect(columnsToCheck(coordLocation)).toEqual(coords);
  });
  test("a third column coord", () => {
    const coordLocation = coordLocationData(new Coord(7, 0), 4, gameboard.grid);
    // prettier-ignore
    const coords = arrayToCoords([[6, 0], [6, 1]]);
    expect(columnsToCheck(coordLocation)).toEqual(coords);
  });
});

describe("row checking coords are correctly returned", () => {
  test("get row coords for checking", () => {
    const coordLocation = coordLocationData(new Coord(3, 1), 4, gameboard.grid);
    // prettier-ignore
    const coords = arrayToCoords([[2, 0], [3, 0], [4, 0]]);
    expect(rowsToCheck(coordLocation)).toEqual(coords);
  });

  test("another row coord", () => {
    const coordLocation = coordLocationData(new Coord(0, 0), 4, gameboard.grid);
    // prettier-ignore
    const coords = arrayToCoords([[0, 0], [1, 0]]);
    expect(rowsToCheck(coordLocation)).toEqual(coords);
  });
});

function arrayToCoords(coords: number[][]) {
  return coords.map(([y, x]) => {
    return new Coord(y, x);
  });
}
