import Ship from "../classes/Ship";

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
