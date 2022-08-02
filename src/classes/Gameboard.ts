import { useState } from "react";

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
}

// '~' for water
// 's' for ship
// 'o' for missed shots
// 'x' for hit shots

// create the grid array for calculations. For this, might as well make it a 2d array? Nah. Actually, maybe...
// place ship at
// reposition ship
//
