import Gameboard from "../classes/Gameboard";

import { describe, beforeEach, test, expect } from "vitest";

describe("grid matrix array ", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });
  test("generate a 10x10 gameboard array", () => {
    gameboard.createBoard();

    expect(gameboard.grid.length).toEqual(10);
    gameboard.grid.forEach((row) => {
      expect(row.length).toEqual(10);
      expect(row[0]).toEqual("~");
    });
  });

  test("generate a 12x12 gameboard array", () => {
    gameboard.createBoard(12);
    expect(gameboard.grid.length).toEqual(12);
    expect(gameboard.grid[0].length).toEqual(12);
  });
});
// describe("gameboard", () => {
//   let gameboard;
//   beforeEach(() => {
//     gameboard = new Gameboard();
//   });
// });

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
