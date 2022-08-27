import { nanoid } from "nanoid";
import React, { createRef } from "react";
import create from "zustand";
import { TILE_GAP, TILE_SIZE } from "../../App";
import AI from "../classes/AI";
import Coord from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import { TileData } from "../types/types";
const useGameStore = create<GameState>((set) => ({
  direction: false,
  hover: false,
  placingShip: false,
  grid: createTiles(),
  setGrid: () => set((state) => ({ grid: state.grid })),
}));

export default useGameStore;
interface GameState {
  direction: boolean;
  hover: boolean;
  placingShip: boolean;
  grid: TileData[][];
  setGrid: () => void;
}

//Based on the current ship clicked
//  the ship length
//  direction
//  follow mouse position

/**
 *
 * FAKE SERVER
 *
 */

const gameboard = new Gameboard({ boardLength: [20, 20] });
gameboard.addPlayer(new AI("bot1"), new AI("bot2"), new AI("bot3"));
gameboard.players.forEach((p) => {
  p.ships.forEach((s) => gameboard.placeShipRandom(s));
});

// all the gameboard data, game data will be stored on server side
// the data that should only be displayed here is the grid
// players information

// the grid is the main data. We need to update this constantly
// when user clicks something, we update it
function createTiles() {
  const grid: TileData[][] = [];
  for (let y = 0; y < gameboard.length[0]; y++) {
    grid[y] = [];
    for (let x = 0; x < gameboard.length[1]; x++) {
      grid[y][x] = {
        id: nanoid(),
        coord: new Coord(y, x),
        state: gameboard.grid[y][x],
        hit: false,
        y: y * (TILE_SIZE + TILE_GAP),
        x: x * (TILE_SIZE + TILE_GAP),
      };
    }
  }
  return grid;
}
