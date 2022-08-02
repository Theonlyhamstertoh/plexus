import Ship from "../classes/Ship";
import {
  checkFit,
  checkPositionsIfValid,
  coordLocationData,
  getColDownToCheck,
  getPositionsFromCoord,
  getRightRowsToCheck,
} from "../positionValidator";
import { describe, beforeEach, test, expect } from "vitest";
let ship: Ship;

describe("ship", () => {
  beforeEach(() => {
    ship = new Ship(4, [0, 1, 2, 3]);
  });
  test("ship should return total lives", () => {
    expect(ship.lives).toBe(4);
  });

  test("ship should take a hit", () => {
    ship.isHit();
    expect(ship.lives).toEqual(3);
  });

  test("ship should be destroyed", () => {
    ship.isHit();
    ship.isHit();
    ship.isHit();
    ship.isHit();
    expect(ship.lives).toEqual(0);
    expect(ship.isDestroyed).toBe(true);
  });
});

describe("ship position validator", () => {
  test("function should generate an array of positions", () => {
    expect(getPositionsFromCoord("down", 34, 5)).toEqual([34, 44, 54, 64, 74]);
    expect(getPositionsFromCoord("right", 14, 4)).toEqual([14, 15, 16, 17]);
  });
  test("check the ship positions if it fits", () => {
    expect(checkFit(21, 3, "right")).toBe(true);
    expect(checkFit(99, 3, "down")).toBe(false);
    expect(checkFit(99, 3, "right")).toBe(false);
    expect(checkFit(70, 4, "right")).toBe(true);
  });

  test("gather coord location data", () => {
    const coordLocation = coordLocationData(40, 4);
    expect(coordLocation.isFirstColumn).toBe(true);
    expect(coordLocation.isLastColumn).toBe(false);
    expect(coordLocation.isLastRow).toBe(false);
  });
  test("get column coords for checking", () => {
    expect(getColDownToCheck(coordLocationData(31, 4))).toEqual([20, 21, 22]);
    expect(getColDownToCheck(coordLocationData(6, 4))).toEqual([5, 6, 7]);
    expect(getColDownToCheck(coordLocationData(19, 4))).toEqual([8, 9]);
    expect(getColDownToCheck(coordLocationData(33, 4))).not.toEqual([1, 6, 7]);
  });

  test("get row coords for checking", () => {
    expect(getRightRowsToCheck(coordLocationData(54, 3))).toEqual([43, 53, 63]);
    expect(getRightRowsToCheck(coordLocationData(0, 3))).toEqual([0, 10]);
    expect(getRightRowsToCheck(coordLocationData(90, 6))).toEqual([80, 90]);
  });

  test("check if position is valid", () => {
    const grid = [...Array(100)].fill(`~`);

    expect(checkPositionsIfValid("right", 70, 4, grid)).toBe(true);
  });
});

// test("return the coordinates adjacent to ship from above", () => {
// expect(checkPositionsIfValid("right", 70, 4)).toEqual([61, 62, 63, 64, 65, 66]);
// });
