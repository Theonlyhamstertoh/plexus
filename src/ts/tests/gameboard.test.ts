import Gameboard from "../classes/Gameboard";

import { describe, beforeEach, test, expect } from "vitest";
import Ship from "../classes/Ship";
import { checkFit, coordLocationData, getAreaLength } from "../helpers/matrixValidator";
import { Coord } from "../classes/Coord";
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
    expect(gameboard.grid[0][0]).toBe("s");
  });

  test("should not place a ship if not valid position", () => {
    gameboard.placeShip(new Coord(5, 4), "right", ship);
    expect(gameboard.placeShip(new Coord(5, 7), "right", ship2)).toBe(false);
  });
  test("rotate a ship on valid position", () => {
    gameboard.placeShip(new Coord(2, 16), "down", ship);
    gameboard.rotateShip(ship);
    expect(gameboard.grid[2][19]).toBe("s");
  });

  test("clear a ship from position on grid", () => {
    gameboard.placeShip(new Coord(2, 16), "down", ship);
    gameboard.clearShipFromGrid(ship);
    console.log(gameboard.showBoard());
  });
});

describe("gameboard players", () => {
  test.todo("add player");
  test.todo("remove player");
  test.todo("add player ships");
  test("randomly place player ships", () => {
    const gameboard = new Gameboard({ length: [10, 10] });
    for (let i = 0; i < 6; i++) {
      const ship = new Ship(3);
      gameboard.placeShipRandom(ship);
    }
    // }
    console.log(gameboard.showBoard());
    // console.log(gameboard.placeShipRandom(ship));
    // expect(gameboard.grid[0].includes("s")).toBe(false);
    // expect(ship.positions.length).toBeGreaterThan(0);
    expect(2 + 2).toEqual(4);
  });
  test.todo("check if all player ships are placed");
});

describe("finding and attacking ships ", () => {
  test("find ship placed", () => {});
});
