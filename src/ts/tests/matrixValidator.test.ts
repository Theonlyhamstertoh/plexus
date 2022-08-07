import { describe, test, beforeEach, expect, getRunningMode } from "vitest";
import { Coord } from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import { createShipPositions, flipDirectionByCoords, getShipDirection } from "../helpers/getShipLocation";
import { checkFit, checkPositionsIfValid, columnsToCheck, coordLocationData, rowsToCheck } from "../helpers/matrixValidator";
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
    const coordData = coordLocationData(new Coord(10, 1), gameboard.grid);
    expect(checkFit(coordData, "down", 3)).toBe(false);
  });

  test("gather coord location data", () => {
    const coordData = coordLocationData(new Coord(4, 0), gameboard.grid);
    expect(coordData.isFirstColumn).toBe(true);
    expect(coordData.isLastColumn).toBe(false);
    expect(coordData.isLastRow).toBe(false);
  });

  test("check if position is valid", () => {
    expect(checkPositionsIfValid("right", new Coord(7, 0), 4, gameboard.grid)).toBe(true);
    expect(checkPositionsIfValid("down", new Coord(0, 0), 4, gameboard.grid)).toBe(true);
    expect(checkPositionsIfValid("down", new Coord(10, 0), 4, gameboard.grid)).toBe(false);
  });

  test("get column coords for checking", () => {
    const coordLocation = coordLocationData(new Coord(3, 1), gameboard.grid);
    // prettier-ignore
    expect(columnsToCheck(coordLocation)).toEqual(arrayToCoords([[2, 0], [2, 1], [2, 2]]));
  });

  test("get row coords for checking", () => {
    const coordLocation = coordLocationData(new Coord(3, 1), gameboard.grid);
    // prettier-ignore
    expect(rowsToCheck(coordLocation)).toEqual(arrayToCoords([[2, 0], [3, 0], [4, 0]]));
  });

  test("get the ship direction based on position", () => {
    const positions = createShipPositions("down", new Coord(3, 1), 4);
    expect(getShipDirection(positions)).toBe("down");
  });

  test("flip ship direction", () => {
    const positions = createShipPositions("down", new Coord(3, 1), 4);
    expect(flipDirectionByCoords(positions)).toBe("right");
  });
});

function arrayToCoords(coords: number[][]) {
  return coords.map(([y, x]) => {
    return new Coord(y, x);
  });
}
