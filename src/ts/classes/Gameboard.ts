import { useState } from "react";
import { checkPositionsIfValid } from "../helpers/positionValidator";
import { Directions } from "../types/types";
import Ship from "./Ship";

export default class Gameboard {
  grid: string[][] = [];
  constructor() {}

  createBoard(num: number = 10) {
    for (let col = 0; col < num; col++) {
      this.grid[col] = [];
      for (let row = 0; row < num; row++) {
        this.grid[col][row] = "~";
      }
    }
  }

  placeShipAt(ship: Ship, coord: number, direction: Directions) {
    checkPositionsIfValid(direction, coord, length, this.grid);
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
