import Gameboard from "../classes/Gameboard";

import { describe, beforeEach, test, expect } from "vitest";
import Ship from "../classes/Ship";

describe("grid matrix array ", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });
  test("generate a 10x10 gameboard array", () => {
    gameboard.createBoard();

    expect(gameboard.grid.length).toEqual(100);
  });

  test("generate a 12x12 gameboard array", () => {
    gameboard.createBoard(12);
    expect(gameboard.grid.length).toEqual(144);
  });
});

describe("placing and moving ships ", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    gameboard.createBoard(10);
  });

  test("place ship at specific coords", () => {
    const ship = new Ship(4);
    const ship2 = new Ship(3);
    gameboard.placeShipAt(0, "right", ship);
    // can't place ship in same spot. But it should ignore its own.
    gameboard.placeShipAt(5, "down", ship2);
    console.log(gameboard.showBoard());
    expect(gameboard.grid[0]).toBe("s");
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
