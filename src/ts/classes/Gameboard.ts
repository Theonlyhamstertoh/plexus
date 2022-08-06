import { nanoid } from "nanoid";
import { createShipPositions, flipShipDirection, getShipDirection } from "../helpers/getShipLocation";
import { checkPositionsIfValid, Coord } from "../helpers/matrixValidator";
import { Directions, Grid, BoardLength, GameBoardParams } from "../types/types";
import { Player } from "./Player";
import Ship from "./Ship";

export default class Gameboard {
  grid: Grid = [];
  length: BoardLength;
  players: Player[] = [];
  constructor({ length }: GameBoardParams) {
    this.length = length;
    this.newBoard(length);
  }

  changeShipGridPosTo(mode: Mode, ship: Ship) {
    if (ship.positions.length === 0) return;
    ship.positions.forEach(({ y, x }) => (this.grid[y][x] = modeTypes[mode]));
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

  resetBoard() {
    for (let y = 0; y < this.length[0]; y++) {
      for (let x = 0; x < this.length[1]; x++) {
        this.grid[y][x] = "~";
      }
    }
  }

  showBoard() {
    return this.grid.map((row) => {
      return JSON.stringify(row);
    });
  }

  placeShip(coord: Coord, direction: Directions, ship: Ship) {
    // if new ship, nothing happens, function returns
    this.changeShipGridPosTo("edit", ship);
    // test if the position are valid
    const validity = checkPositionsIfValid(direction, coord, ship.length, this.grid);
    if (validity === false) {
      this.changeShipGridPosTo("show", ship);
      return null;
    }

    // remove previous ship positions if it was already placed
    this.changeShipGridPosTo("clear", ship);
    ship.positions = [];
    ship.positions = createShipPositions(direction, coord, ship.length);
    ship.positions.forEach(({ y, x }: Coord) => (this.grid[y][x] = "s"));
    return ship.positions;
  }

  rotateShip(ship: Ship) {
    if (ship.positions.length === 0) throw Error("SHIP NOT YET PLACED");
    const newDirection = flipShipDirection(ship.positions);
    return this.placeShip(ship.positions[0], newDirection, ship);
  }

  removeShip(ship: Ship) {
    this.changeShipGridPosTo("clear", ship);
  }

  findShip(coord: Coord, teamId: string) {
    const team = this.teams.get(teamId);
    if (team === undefined) return;

    return team.players.find((player) => {
      return player.ships.find((ship) => ship.positions.includes(coord));
    });
  }
}

const modeTypes = {
  edit: "@",
  show: "s",
  clear: "~",
};
type Mode = "edit" | "show" | "clear";

// '~' for water
// '@' for ship being edited
// '' for ship
// 'o' for missed shots
// 'x' for hit shots

// create the grid array for calculations. For this, might as well make it a 2d array? Nah. Actually, maybe...
// place ship at
// reposition ship
//
