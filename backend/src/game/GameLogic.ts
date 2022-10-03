import { nanoid } from "nanoid";
import {
  createShipPositions,
  flipDirection,
  flipDirectionByCoords,
  getRandomNumber,
  getRandomPosition,
} from "./helpers/shipUtilities.js";
import { checkPositionsIfValid } from "./helpers/matrixValidator.js";
import {
  Directions,
  Grid,
  BoardLength,
  MARKS,
  CONFIG,
  GameConfigs,
  MarkTypes,
} from "./types/types";
import Coord from "./classes/Coord.js";
import Player from "./classes/Player.js";
import AI from "./classes/AI.js";
import Ship from "./classes/Ship.js";

const GameLogic = (() => {
  function getBoardState(players: (Player | AI)[]) {
    let shipsDamaged: number = 0;
    let shipsDestroyed: number = 0;
    let shipsAlive: number = 0;
    const hits: Coord[] = [];
    players.forEach((player) =>
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

  function getCurrentPlayer(players: (Player | AI)[]): Player | AI {
    return players[0];
  }

  function nextTeammate(players: (Player | AI)[]) {
    const prevPlayer = players[0];
    players.shift();
    players.push(prevPlayer);
  }

  function addPlayer(...players: (Player | AI)[]) {
    players.push(...players);
  }

  function shufflePlayers(players: (Player | AI)[]) {
    for (let i = 0; i < players.length; i++) {
      // the next item or current
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }
    return players;
  }

  function removePlayer(playerId: string, players: (Player | AI)[]) {
    players.find((player, index) => {
      if (playerId === player.id) players.splice(index, 1);
    });
  }

  function getPlayerByName(name: string, players: (Player | AI)[]) {
    return players.find((player) => {
      if (player.username && player.username === name) {
        return player;
      }
    });
  }

  function getPlayerById(playerId: string, players: (Player | AI)[]) {
    return players.find((player) => player.id === playerId);
  }

  function receiveAttack(
    coord: Coord,
    players: (Player | AI)[],
    notHitCoords: Coord[],
    grid: Grid
  ) {
    if (grid[coord.y][coord.x] === MARKS.HIT || grid[coord.y][coord.x] === MARKS.MISS_HIT)
      return false;
    // filter out hit coordinates
    notHitCoords = notHitCoords.filter((c) => c.x !== coord.x || c.y !== coord.y);

    if (grid[coord.y][coord.x] === MARKS.SHIP) {
      const ship = findShip(coord, players);
      if (ship === false) throw Error("no ship was found");
      ship.isHit(coord);

      grid[coord.y][coord.x] = MARKS.HIT;
      return true;
    }

    grid[coord.y][coord.x] = MARKS.MISS_HIT;
    return false;
  }

  function changeShipGridPosTo(mode: MarkTypes, ship: Ship, grid: Grid) {
    if (ship.positions.length === 0) return;
    ship.positions.forEach(({ y, x }) => (grid[y][x] = MARKS[mode]));
  }

  function newBoard(length: BoardLength) {
    // reset grid
    const grid: Grid = [];
    const notHitCoords = [];
    for (let y = 0; y < length[0]; y++) {
      grid[y] = [];
      for (let x = 0; x < length[1]; x++) {
        grid[y][x] = MARKS.WATER;
        notHitCoords.push(new Coord(y, x));
      }
    }
    return { grid, length, notHitCoords };
  }

  function resetBoard(length: BoardLength) {
    const newGrid: Grid = [];
    for (let y = 0; y < length[0]; y++) {
      for (let x = 0; x < length[1]; x++) {
        newGrid[y][x] = MARKS.WATER;
      }
    }
    return newGrid;
  }

  function showBoard(grid: Grid) {
    return grid.map((row) => {
      return JSON.stringify(row);
    });
  }
  function placeShipRandom(ship: Ship, length: BoardLength, grid: Grid) {
    let attempts = 0;
    do {
      if (attempts > 1000) throw Error("Attempt exceeded limits of 1000");
      attempts++;
      const coordY = getRandomNumber(length[0]);
      const coordX = getRandomNumber(length[1]);
      const direction = getRandomPosition();
      const oppositeDirection = flipDirection(direction);
      ship.placed = placeShip(new Coord(coordY, coordX), direction, ship, grid);

      if (ship.placed === true) return;
      ship.placed = placeShip(new Coord(coordY, coordX), oppositeDirection, ship, grid);
    } while (!ship.placed);
  }

  function placeShip(coord: Coord, direction: Directions, ship: Ship, grid: Grid) {
    // if new ship, nothing happens, function returns
    changeShipGridPosTo("EDIT", ship, grid);
    // test if the position are valid
    const validity = checkPositionsIfValid(direction, coord, ship.length, grid);
    if (validity === false) {
      changeShipGridPosTo("SHIP", ship, grid);
      return false;
    }

    // remove previous ship positions if it was already placed
    changeShipGridPosTo("WATER", ship, grid);
    ship.positions = [];
    ship.positions = createShipPositions(direction, coord, ship.length);
    ship.positions.forEach(({ y, x }: Coord) => (grid[y][x] = MARKS.SHIP));
    ship.placed = true;
    return true;
  }

  function rotateShip(ship: Ship, grid: Grid) {
    if (ship.positions.length === 0) throw Error("SHIP NOT YET PLACED");
    const newDirection = flipDirectionByCoords(ship.positions);
    return placeShip(ship.positions[0], newDirection, ship, grid);
  }

  function removeShip(ship: Ship, grid: Grid) {
    changeShipGridPosTo("WATER", ship, grid);
    ship.positions = [];
    ship.placed = false;
  }

  function findShip({ y, x }: Coord, players: (Player | AI)[]) {
    for (let i = 0; i < players.length; i++) {
      const ship: Ship | undefined = players[i].ships.find((ship: Ship) => {
        return ship.positions.find((pos: Coord) => pos.y === y && pos.x === x);
      });
      if (ship !== undefined) return ship;
    }
    return false;
  }

  return {
    getBoardState,
    getCurrentPlayer,
    nextTeammate,
    addPlayer,
    shufflePlayers,
    removePlayer,
    getPlayerByName,
    getPlayerById,
    receiveAttack,
    changeShipGridPosTo,
    newBoard,
    resetBoard,
    showBoard,
    placeShipRandom,
    placeShip,
    rotateShip,
    removeShip,
    findShip,
  };
})();
// '~' for water
// '@' for ship being edited
// 's' for ship
// 'o' for missed shots
// 'x' for hit shots

export default GameLogic;
