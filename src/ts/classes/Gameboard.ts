import { useState } from "react";
import { getPositionsFromCoord } from "../helpers/getShipLocation";
import { checkPositionsIfValid } from "../helpers/positionValidator";
import { Directions } from "../types/types";
import Ship from "./Ship";

export default class Gameboard {
  grid: string[] = [];
  constructor() {}

  createBoard(num: number = 10) {
    this.grid = [...Array(num * num).fill("~")];
  }

  showBoard() {
    const board = [];
    for (let i = 0; i < Math.sqrt(this.grid.length); i++) {
      board.push(this.grid.slice(i * 10, i * 10 + 10));
      if (this.grid.length === 0) break;
    }
    return board.map((arr) => JSON.stringify(arr));
  }

  placeShipAt(ship: Ship, coord: number, direction: Directions) {
    // testing if the positions are valid
    const validity = checkPositionsIfValid(direction, coord, ship.length, this.grid);
    if (validity === false) return;

    // placing ship at the coordinate
    ship.positions = getPositionsFromCoord(direction, coord, ship.length);
    ship.positions.forEach((tile) => {
      this.grid[tile] = "s";
    });
  }
}

// '~' for water
// 's' for ship
// 'o' for missed shots
// 'x' for hit shots

// create the grid array for calculations. For this, might as well make it a 2d array? Nah. Actually, maybe...
// place ship at
// reposition ship
//
