import { expect, test } from "vitest";
import Coord from "../classes/Coord";
import Player, { getAttacksInDirection } from "../classes/Player";

test.todo("bot should inherit player class", () => {});

test("return array of possible attacks within one direction if hit twice", () => {
  console.log(getAttacksInDirection([new Coord(3, 10), new Coord(3, 9)]));
  expect(getAttacksInDirection([new Coord(3, 9), new Coord(2, 9)])).toEqual([
    new Coord(1, 9),
    new Coord(4, 9),
  ]);
});
