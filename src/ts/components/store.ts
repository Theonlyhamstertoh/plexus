import { nanoid } from "nanoid";
import React, { createRef } from "react";
import create from "zustand";
import AI from "../classes/AI";
import Coord from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import {
  BoardLength,
  DEFAULT_TILE_FILL,
  DEFAULT_TILE_STROKE,
  Grid,
  MARKS,
  PLAYER_COLORS,
  TileData,
} from "../types/types";

export const TILE_SIZE = 50;
export const TILE_GAP = 5;
export const SMALL_TILE_GAP = 3;
export const SMALL_TILE_SIZE = 14;
export const GUIDE_SIZE = TILE_SIZE / 2;
export const CORNER_RADIUS = 0.16;

// --------------------------
const gameboard = new Gameboard({ boardLength: [15, 20] });
gameboard.addPlayer(new AI("bot1"), new AI("bot2"), new AI("bot3"), new AI("bot4"));
gameboard.players.forEach((p) => {
  p.ships.forEach((s) => gameboard.placeShipRandom(s));
});
// --------------------------

const INITIALIZE_BOARD = (grid: Grid, length: BoardLength) => {
  const board: TileData[][] = [];
  for (let y = 0; y < length[0]; y++) {
    board[y] = [];
    for (let x = 0; x < length[1]; x++) {
      board[y][x] = {
        id: nanoid(),
        coord: new Coord(y, x),
        y: y * (TILE_SIZE + TILE_GAP),
        x: x * (TILE_SIZE + TILE_GAP),
        fill: DEFAULT_TILE_FILL,
        // fill: grid[y][x] === MARKS.SHIP ? PLAYER_COLORS[3] : DEFAULT_TILE_FILL,
        stroke: DEFAULT_TILE_STROKE,
        state: grid[y][x],
      };
    }
  }
  console.clear();
  console.log(gameboard.showBoard());
  return board;
};

const useGameStore = create<GameState>((set) => ({
  direction: false,
  hover: false,
  gameMode: "board_setup",
  placingShip: false,
  playerData: {
    color: "",
    name: "",
  },
  board: INITIALIZE_BOARD(gameboard.grid, gameboard.length),
  setBoard: (board) => set((state) => ({ board: state.board })),
  setGameMode: (mode: GameModes) => set((s) => ({ gameMode: mode })),
}));
export default useGameStore;

interface GameState {
  direction: boolean;
  hover: boolean;
  gameMode: GameModes;
  placingShip: boolean;
  playerData: {
    color: string;
    name: string;
  };
  board: TileData[][];
  setBoard: (board: TileData[][]) => void;
  setGameMode: (mode: GameModes) => void;
}

type GameModes = "game_setup" | "board_setup" | "game_started" | "game_over";
//Based on the current ship clicked
//  the ship length
//  direction
//  follow mouse position

/**
 *
 * FAKE SERVER
 *
 */

// all the gameboard data, game data will be stored on server side
// the data that should only be displayed here is the grid
// players information

// the grid is the main data. We need to update this constantly
// when user clicks something, we update it

// let me see my ships on the left and my teammates
// keep track of all players and teammates too.
// data is simply sent. No one in the client. No data of other players should be stored there. Just information sent.
// I want to see my ship color
// every player will have their unique color stored
