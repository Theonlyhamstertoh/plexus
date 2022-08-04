import Gameboard from "../classes/Gameboard";

import { describe, beforeEach, test, expect } from "vitest";
import Ship from "../classes/Ship";

describe("grid matrix array ", () => {
  let gameboard: Gameboard;
  beforeEach(() => {
    // gameboard = new Gameboard({ length: [10, 10] });
  });
  test.skip("generate a 10x10 gameboard array", () => {
    // gameboard.newBoard([10, 10]);
    // expect(gameboard.grid.length).toEqual(10);
  });

  test.skip("generate a 12x12 gameboard array", () => {
    // gameboard.newBoard([12, 12]);
    // expect(gameboard.grid.length).toEqual(12);
  });
});

// describe.skip("placing and moving ships ", () => {
//   let gameboard: Gameboard;
//   let ship: Ship;
//   let ship2: Ship;
//   beforeEach(() => {
//     // gameboard = new Gameboard({ length: [10, 10] });
//     ship = new Ship(4);
//     ship2 = new Ship(3);
//   });

//   test.skip("place ship at specific coords", () => {
//     gameboard.placeShipAt(0, "right", ship);
//     // can't place ship in same spot. But it should ignore its own.
//     gameboard.placeShipAt(5, "down", ship2);
//     expect(gameboard.grid[0]).toBe("s");
//   });

//   test.skip("should not rotate a ship if not valid position", () => {
//     gameboard.placeShipAt(54, "right", ship);
//     gameboard.placeShipAt(74, "right", ship2);

//     expect(gameboard.rotateShip(ship)).toBe("NOT VALID POSITION");
//   });
//   test.skip("rotate a ship on valid position", () => {
//     gameboard.placeShipAt(34, "right", ship);
//     gameboard.placeShipAt(74, "right", ship2);

//     gameboard.rotateShip(ship);
//     console.log(gameboard.showBoard());
//     expect(ship.positions).not.toBe("NOT VALID POSITION");
//   });

//   test.todo("update ship position and clear out old coords");
//   test.todo("remove a ship from position");
//   test.todo("rotate a ship");

//   test.todo("is game over");
//   test.todo("is ready to start");
// });
// const grid = [
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
//   ["~", "~", "~", "~", "~", "~", "~", "~", "~", "~"],
// ];
