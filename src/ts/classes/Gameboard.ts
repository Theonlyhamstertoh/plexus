import { nanoid } from "nanoid";
import { createShipPositions, flipShipDirection, getShipDirection } from "../helpers/getShipLocation";
import { checkPositionsIfValid } from "../helpers/matrixValidator";
import { Directions, Grid, BoardLength, GameBoardParams } from "../types/types";
import { Coord } from "./Coord";
import { Player } from "./Player";
import Ship from "./Ship";
export default class Gameboard {
  grid: Grid = [];
  length: BoardLength;
  players: Player[] = [];
  readonly id: string = nanoid();
  constructor({ length }: GameBoardParams) {
    this.length = length;
    this.newBoard(length);
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  removePlayer(playerId: string) {
    this.players.find((player, index) => {
      if (playerId === player.id) this.players.splice(index, 1);
    });
  }

  receiveAttack(coord: Coord) {
    // check if it hits
    if (this.grid[coord.y][coord.x] === MARKS.SHIP) {
      const ship = this.findShip(coord);
      if (ship === null) throw Error("no ship was found");
      ship.isHit();
      return this.grid[coord.y][coord.x] === MARKS.HIT;
    }

    return this.grid[coord.y][coord.x] === MARKS.MISS_HIT;
  }
  changeShipGridPosTo(mode: Mode, ship: Ship) {
    if (ship.positions.length === 0) return;
    ship.positions.forEach(({ y, x }) => (this.grid[y][x] = modeTypes[mode]));
  }
  newBoard(length: BoardLength) {
    // reset grid
    this.length = length;
    this.grid = [];
    for (let y = 0; y < length[0]; y++) {
      this.grid[y] = [];
      for (let x = 0; x < length[1]; x++) {
        this.grid[y][x] = MARKS.WATER;
      }
    }
    return this.grid;
  }

  resetBoard() {
    for (let y = 0; y < this.length[0]; y++) {
      for (let x = 0; x < this.length[1]; x++) {
        this.grid[y][x] = MARKS.WATER;
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
    ship.positions.forEach(({ y, x }: Coord) => (this.grid[y][x] = MARKS.SHIP));
    return ship.positions;
  }

  rotateShip(ship: Ship) {
    if (ship.positions.length === 0) throw Error("SHIP NOT YET PLACED");
    const newDirection = flipShipDirection(ship.positions);
    return this.placeShip(ship.positions[0], newDirection, ship);
  }

  clearShipFromGrid(ship: Ship) {
    this.changeShipGridPosTo("clear", ship);
  }

  findShip(coord: Coord): Ship | null {
    for (let i = 0; i < this.players.length; i++) {
      const ship: Ship | undefined = this.players[i].ships.find((ship) => {
        return ship.positions.includes(coord) ? ship : false;
      });
      if (ship !== undefined) return ship;
    }
    return null;
  }
}

const modeTypes = {
  edit: "@",
  show: "s",
  clear: "~",
};
type Mode = keyof typeof modeTypes;

const gameMode = {
  spectate: "spectate",
  disconnected: "disconnected",
  alive: "alive",
};

const MARKS = {
  WATER: "~",
  EDIT: "@",
  SHIP: "s",
  MISS_HIT: "o",
  HIT: "x",
};
// '~' for water
// '@' for ship being edited
// 's' for ship
// 'o' for missed shots
// 'x' for hit shots
