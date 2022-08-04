import { describe, test, beforeEach, expect, getRunningMode } from "vitest";
import Gameboard, {
  checkFit,
  Coord,
  coordLocationData,
  getPositionsFromCoord,
} from "../helpers/matrixValidator";

describe("ship position validator", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard({ boardLength: [12, 18] });
  });
  test("function should generate an array of positions", () => {
    expect(getPositionsFromCoord("down", new Coord(3, 1), 4)).toEqual(
      arrayToCoords([
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
      ])
    );

    expect(getPositionsFromCoord("right", new Coord(1, 4), 4)).toEqual(
      arrayToCoords([
        [1, 4],
        [1, 5],
        [1, 6],
        [1, 7],
      ])
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
  test.todo("get column coords for checking", () => {});

  test.todo("get row coords for checking", () => {});

  test.todo("check if position is valid", () => {});

  test.todo("convert coord to matrix table usable", () => {});

  test.todo("get the ship direction based on position", () => {});
});

function arrayToCoords(coords: number[][]) {
  return coords.map(([y, x]) => {
    return new Coord(y, x);
  });
}
