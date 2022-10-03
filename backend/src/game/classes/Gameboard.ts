import { nanoid } from "nanoid";
import {
  createShipPositions,
  flipDirection,
  flipDirectionByCoords,
  getRandomNumber,
  getRandomPosition,
} from "../helpers/shipUtilities.js";
import { checkPositionsIfValid } from "../helpers/matrixValidator.js";
import {
  Directions,
  Grid,
  BoardLength,
  MARKS,
  CONFIG,
  GameConfigs,
  MarkTypes,
} from "../types/types.js";

import Coord from "./Coord.js";
import Player from "./Player.js";
import Ship from "./Ship.js";
import AI from "./AI.js";

export default class Gameboard {
  grid: Grid = [];
  players: (Player | AI)[] = [];
  length: BoardLength;
  notHitCoords: Coord[] = [];
  readonly id: string = nanoid();
  constructor({ boardLength }: GameConfigs) {
    this.length = boardLength;
    this.newBoard(this.length);
  }

  getBoardState() {
    let shipsDamaged: number = 0;
    let shipsDestroyed: number = 0;
    let shipsAlive: number = 0;
    const hits: Coord[] = [];
    this.players.forEach((player) =>
      player.ships.forEach((ship) => {
        if (ship.isDamaged() && ship.isDestroyed === false) {
          hits.push(...ship.hits);
          shipsDamaged++;
        }
        if (ship.isDestroyed === false) shipsAlive++;
        if (ship.isDestroyed === true) shipsDestroyed++;
      })
    );
    return { hits, shipsDamaged, shipsDestroyed, shipsAlive };
  }

  getCurrentPlayer(): Player | AI {
    return this.players[0];
  }

  nextTeammate() {
    const prevPlayer = this.players[0];
    this.players.shift();
    this.players.push(prevPlayer);
  }

  addPlayer(...players: (Player | AI)[]) {
    this.players.push(...players);
  }

  shufflePlayers() {
    for (let i = 0; i < this.players.length; i++) {
      // the next item or current
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
    return this.players;
  }

  removePlayer(playerId: string) {
    this.players.find((player, index) => {
      if (playerId === player.id) this.players.splice(index, 1);
    });
  }

  getPlayerByName(name: string) {
    return this.players.find((player) => {
      if (player.username && player.username === name) {
        return player;
      }
    });
  }

  getPlayerById(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  receiveAttack(coord: Coord) {
    if (this.grid[coord.y][coord.x] === MARKS.HIT || this.grid[coord.y][coord.x] === MARKS.MISS_HIT)
      return false;
    // filter out hit coordinates
    this.notHitCoords = this.notHitCoords.filter((c) => c.x !== coord.x || c.y !== coord.y);

    if (this.grid[coord.y][coord.x] === MARKS.SHIP) {
      const ship = this.findShip(coord);
      if (ship === false) throw Error("no ship was found");
      ship.isHit(coord);

      this.grid[coord.y][coord.x] = MARKS.HIT;
      return true;
    }

    this.grid[coord.y][coord.x] = MARKS.MISS_HIT;
    return false;
  }

  changeShipGridPosTo(mode: MarkTypes, ship: Ship) {
    if (ship.positions.length === 0) return;
    ship.positions.forEach(({ y, x }) => (this.grid[y][x] = MARKS[mode]));
  }

  newBoard(length: BoardLength) {
    // reset grid
    this.length = length;
    this.grid = [];
    for (let y = 0; y < length[0]; y++) {
      this.grid[y] = [];
      for (let x = 0; x < length[1]; x++) {
        this.grid[y][x] = MARKS.WATER;
        this.notHitCoords.push(new Coord(y, x));
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
  placeShipRandom(ship: Ship) {
    let attempts = 0;
    do {
      if (attempts > 1000) throw Error("Attempt exceeded limits of 1000");
      attempts++;
      const coordY = getRandomNumber(this.length[0]);
      const coordX = getRandomNumber(this.length[1]);
      const direction = getRandomPosition();
      const oppositeDirection = flipDirection(direction);
      ship.placed = this.placeShip(new Coord(coordY, coordX), direction, ship);

      if (ship.placed === true) return;
      ship.placed = this.placeShip(new Coord(coordY, coordX), oppositeDirection, ship);
    } while (!ship.placed);
  }

  placeShip(coord: Coord, direction: Directions, ship: Ship) {
    // if new ship, nothing happens, function returns
    this.changeShipGridPosTo("EDIT", ship);
    // test if the position are valid
    const validity = checkPositionsIfValid(direction, coord, ship.length, this.grid);
    if (validity === false) {
      this.changeShipGridPosTo("SHIP", ship);
      return false;
    }

    // remove previous ship positions if it was already placed
    this.changeShipGridPosTo("WATER", ship);
    ship.positions = [];
    ship.positions = createShipPositions(direction, coord, ship.length);
    ship.positions.forEach(({ y, x }: Coord) => (this.grid[y][x] = MARKS.SHIP));
    ship.placed = true;
    return true;
  }

  rotateShip(ship: Ship) {
    if (ship.positions.length === 0) throw Error("SHIP NOT YET PLACED");
    const newDirection = flipDirectionByCoords(ship.positions);
    return this.placeShip(ship.positions[0], newDirection, ship);
  }

  removeShip(ship: Ship) {
    this.changeShipGridPosTo("WATER", ship);
    ship.positions = [];
    ship.placed = false;
  }

  findShip({ y, x }: Coord) {
    for (let i = 0; i < this.players.length; i++) {
      const ship: Ship | undefined = this.players[i].ships.find((ship: Ship) => {
        return ship.positions.find((pos: Coord) => pos.y === y && pos.x === x);
      });
      if (ship !== undefined) return ship;
    }
    return false;
  }
}

// '~' for water
// '@' for ship being edited
// 's' for ship
// 'o' for missed shots
// 'x' for hit shots
