import Ship, { checkPositionsIfValid, positionsFromCoord } from "../classes/Ship";
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
    // expect(ship.lives).toEqual(0);
    expect(ship.isDestroyed).toBe(true);
  });
});

test("positionsFromCoord generate an array of positions", () => {
  expect(positionsFromCoord("down", 1, 4)).toEqual([1, 11, 21, 31]);
  expect(positionsFromCoord("down", 34, 5)).toEqual([34, 44, 54, 64, 74]);
  expect(positionsFromCoord("right", 21, 3)).toEqual([21, 22, 23]);
});

test("return the coordinates adjacent to ship from above", () => {
  expect(checkPositionsIfValid("right", 0, 4)).toEqual([61, 62, 63, 64, 65, 66]);
});
