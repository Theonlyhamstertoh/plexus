import { createShipPositions, flipShipDirection, getShipDirection } from "../helpers/getShipLocation";
import { checkPositionsIfValid, Coord } from "../helpers/matrixValidator";
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

  placeShip(coord: Coord, direction: Directions, ship: Ship) {
    // change ship marks to @ to symbolize it is being edited
    // and to prevent validator to mistake it for another ship
    // if a new ship, then it wouldn't matter because array is empty
    ship.positions.forEach(({ y, x }) => (this.grid[y][x] = "@"));

    // test if the position are valid
    const validity = checkPositionsIfValid(direction, coord, ship.length, this.grid);
    if (!validity) {
      // if ship cannot be move to new position, return to previous position
      ship.positions.forEach(({ y, x }) => (this.grid[y][x] = "s"));
      // new ship will simply be denied placement
      return null;
    }
    ship.positions.forEach(({ y, x }) => (this.grid[y][x] = "~"));

    // if valid, hide it away

    /**                                           **/
    /**       SHIP IS VALIDATED BEYOND HERE       **/
    /**                                           **/

    // remove previous ship positions if it was already placed
    ship.positions = [];

    // get ship coords
    ship.positions = createShipPositions(direction, coord, ship.length);
    ship.positions.forEach(({ y, x }: Coord) => (this.grid[y][x] = "s"));
    return ship.positions;
  }

  editMode() {}
  rotateShip(ship: Ship) {
    if (ship.positions.length === 0) throw Error("SHIP NOT YET PLACED");
    const newDirection = flipShipDirection(ship.positions);
    return this.placeShip(ship.positions[0], newDirection, ship);
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
