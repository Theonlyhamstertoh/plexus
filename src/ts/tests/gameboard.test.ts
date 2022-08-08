import Gameboard from "../classes/Gameboard";

import { describe, beforeEach, test, expect } from "vitest";
import Ship from "../classes/Ship";
import { checkFit, coordLocationData, getAreaLength } from "../helpers/matrixValidator";
import Coord from "../classes/Coord";
import Player from "../classes/Player";

describe("gameboard ship placement", () => {
  let gameboard: Gameboard;
  let ship: Ship;
  let ship2: Ship;
  beforeEach(() => {
    gameboard = new Gameboard({ length: [10, 20] });
    ship = new Ship(4);
    ship2 = new Ship(3);
  });

  test("generate a 10x12 gameboard array", () => {
    gameboard.newBoard([10, 12]);
    expect(gameboard.grid.length).toEqual(10);
    expect(gameboard.grid[0].length).toEqual(12);
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
    gameboard.removeShip(ship);
    expect(ship.positions.length).toEqual(0);
  });
});

describe("gameboard players", () => {
  test.todo("add player");
  test.todo("remove player");
  test.todo("add player ships");
  test("randomly place player ships", () => {
    const gameboard = new Gameboard({ length: [15, 20] });
    const player = new Player("weibo");
    player.ships.forEach((ship) => {
      gameboard.placeShipRandom(ship);
      expect(ship.positions.length).toEqual(ship.length);
    });
    console.log(gameboard.showBoard());
  });
  test("check if all player ships are placed", () => {});
});

describe("finding and attacking ships ", () => {
  test("find ship placed", () => {});
});

// five ships for each player
