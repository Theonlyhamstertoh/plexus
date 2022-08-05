import Gameboard from "../classes/Gameboard";

import { describe, beforeEach, test, expect } from "vitest";
import Ship from "../classes/Ship";
import { Coord } from "../helpers/matrixValidator";

describe("grid matrix array ", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard({ length: [10, 10] });
  });
  test("generate a 10x12 gameboard array", () => {
    gameboard.newBoard([10, 12]);
    expect(gameboard.grid.length).toEqual(10);
    expect(gameboard.grid[0].length).toEqual(12);
  });
});

describe("placing and moving ships ", () => {
  let gameboard: Gameboard;
  let ship: Ship;
  let ship2: Ship;
  beforeEach(() => {
    gameboard = new Gameboard({ length: [10, 20] });
    ship = new Ship(4);
    ship2 = new Ship(3);
  });

  test("place ship at specific coords", () => {
    gameboard.placeShip(new Coord(0, 0), "right", ship);
    // can't place ship in same spot. But it should ignore its own.
    expect(gameboard.grid[0][0]).toBe("s");
  });

  test("should not place a ship if not valid position", () => {
    gameboard.placeShip(new Coord(5, 4), "right", ship);
    expect(gameboard.placeShip(new Coord(5, 7), "right", ship2)).toBe(null);
  });
  test("rotate a ship on valid position", () => {
    gameboard.placeShip(new Coord(3, 4), "right", ship);
    gameboard.placeShip(new Coord(7, 4), "right", ship2);
    gameboard.rotateShip(ship);
    console.log(gameboard.showBoard());
    expect(ship.positions).not.toBe("NOT VALID POSITION");
  });

  test.todo("update ship position and clear out old coords");
  test.todo("remove a ship from position");
  test.todo("rotate a ship");

  test.todo("is game over");
  test.todo("is ready to start");
});
const grid = [
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
  ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
];
