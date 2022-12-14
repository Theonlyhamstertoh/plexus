import Gameboard from "../classes/Gameboard";

import Ship from "../classes/Ship";
import Coord from "../classes/Coord";
import Player from "../classes/Player";
import { BOARD_SIZE, MARKS } from "../types/types";
import { test, expect, describe, beforeEach, afterEach, vitest } from "vitest";

describe("gameboard ship placement", () => {
  let gameboard: Gameboard;
  let ship: Ship;
  let ship2: Ship;
  beforeEach(() => {
    gameboard = new Gameboard({ boardLength: [10, 20] });
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
    expect(gameboard.grid[0][0]).toBe(MARKS.SHIP);
  });

  test("should not place a ship if not valid position", () => {
    gameboard.placeShip(new Coord(5, 4), "right", ship);
    expect(gameboard.placeShip(new Coord(5, 7), "right", ship2)).toBe(false);
  });
  test("rotate a ship on valid position", () => {
    gameboard.placeShip(new Coord(2, 16), "down", ship);
    gameboard.rotateShip(ship);
    expect(gameboard.grid[2][19]).toBe(MARKS.SHIP);
  });

  test("clear a ship from position on grid", () => {
    gameboard.placeShip(new Coord(2, 16), "down", ship);
    gameboard.removeShip(ship);
    expect(ship.positions.length).toEqual(0);
  });

  test("find ship placed at coord", () => {
    const player = new Player("player");
    gameboard.addPlayer(player);
    gameboard.placeShip(new Coord(2, 16), "down", player.ships[0]);
    expect(gameboard.findShip(new Coord(2, 16))).toEqual(player.ships[0]);
  });
});

describe("gameboard players", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard({ boardLength: BOARD_SIZE.BIG });
    gameboard.addPlayer(new Player("weibo"));
  });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  test("add player", () => {
    expect(gameboard.addPlayer(new Player("weibo")));
  });

  test("add multiple players", () => {
    const player1 = new Player("1");
    const player2 = new Player("2");
    gameboard.addPlayer(player1, player2);
    // a player is already added before each test
    expect(gameboard.players.length).toEqual(3);
  });

  test("shuffle player order", () => {
    gameboard.addPlayer(new Player("weibo2"));
    gameboard.addPlayer(new Player("weibo3"));

    vitest.spyOn(global.Math, "random").mockReturnValue(0);
    const oldArray = [...gameboard.players];
    expect(oldArray).not.toEqual(gameboard.shufflePlayers());
  });

  test("move current player to last in line", () => {
    gameboard.addPlayer(new Player("1"), new Player("2"));
    const prevPlayer = gameboard.players[0];
    gameboard.nextTeammate();
    expect(gameboard.players[0]).not.toBe(prevPlayer);
  });

  test("remove player by id", () => {
    const player = new Player("John");
    gameboard.addPlayer(player);
    gameboard.removePlayer(player.id);
    expect(gameboard.getPlayerByName("John")).toBeFalsy();
  });
  test("add player ships", () => {
    const firstShip = gameboard.getPlayerByName("weibo")?.ships[0];
    if (firstShip === undefined) return;
    gameboard.placeShip(new Coord(0, 2), "right", firstShip);
    expect(firstShip.placed).toBeTruthy();
  });
  test("randomly place player ships", () => {
    const player = new Player("John");
    player.ships.forEach((ship) => {
      gameboard.placeShipRandom(ship);
      expect(ship.positions.length).toEqual(ship.length);
    });
  });
  test("check if all player ships are placed", () => {
    const player = gameboard.getPlayerByName("weibo")!;
    player.ships.forEach((ship) => gameboard.placeShipRandom(ship));
    expect(player.isReady()).toBeTruthy();
  });
});

// five ships for each player

// Every player has five ships or 4 ships
