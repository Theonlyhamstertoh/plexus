import { expect, test } from "vitest";
import Coord from "../classes/Coord";
import Player, { getAttacksInDirection, sortHitsAcsending } from "../classes/Player";

test.todo("bot should inherit player class", () => {});

test("return array of possible attacks within one direction if hit twice", () => {
  expect(getAttacksInDirection([new Coord(3, 9), new Coord(2, 9)], [12, 12])).toEqual([
    new Coord(1, 9),
    new Coord(4, 9),
  ]);
});

test("attack coords outside of board should not be sent", () => {
  expect(getAttacksInDirection([new Coord(0, 0), new Coord(0, 1)], [10, 10])).toEqual([
    new Coord(0, 2),
  ]);
});

test("sort the array from low to highest depending on direction", () => {
  const coords = [new Coord(4, 10), new Coord(3, 10), new Coord(2, 10)];
  const sortedCoords = [new Coord(2, 10), new Coord(3, 10), new Coord(4, 10)];

  expect(sortHitsAcsending(coords)).toEqual(sortedCoords);
});
