import { flipShipDirection, getPositionsFromCoord, getShipDirection } from "../helpers/getShipLocation";
import { Directions, Grid, BoardLength, GameBoardParams } from "../types/types";
import Ship from "./Ship";

export default class Gameboard {
  grid: Grid = [];
  length: BoardLength;
  constructor({ length }: GameBoardParams) {
    this.length = length;
    this.newBoard(length);
  }

  newBoard(length: BoardLength) {
    // reset grid
    this.grid = [];
    for (let y = 0; y < length[0]; y++) {
      this.grid[y] = [];
      for (let x = 0; x < length[1]; x++) {
        this.grid[y][x] = "~";
      }
    }
    return this.grid;
  }

  showBoard() {
    return this.grid.map((row) => {
      return JSON.stringify(row);
    });
  }

  placeShipAt(coord: number, direction: Directions, ship: Ship) {
    // convert to '~' (water) to pass validity check
    ship.positions.forEach((tile) => (this.grid[tile] = "~"));

    // testing if the positions are valid
    const validity = checkPositionsIfValid(direction, coord, ship.length, this.grid);
    if (validity === false) {
      ship.positions.forEach((tile) => (this.grid[tile] = "s"));
      return "NOT VALID POSITION";
    }
    // remove previous ship position and reset array
    ship.positions = [];

    // placing ship at the coordinate
    ship.positions = getPositionsFromCoord(direction, coord, ship.length);
    ship.positions.forEach((tile) => {
      this.grid[tile] = "s";
    });
    return ship.positions;
  }

  rotateShip(ship: Ship) {
    if (ship.positions.length === 0) throw Error("SHIP NOT YET PLACED");
    const newDirection = flipShipDirection(ship.positions);
    return this.placeShipAt(ship.positions[0], newDirection, ship);
  }
}

// '~' for water
// '@' for ship being edited
// '' for ship
// 'o' for missed shots
// 'x' for hit shots

// create the grid array for calculations. For this, might as well make it a 2d array? Nah. Actually, maybe...
// place ship at
// reposition ship
//
