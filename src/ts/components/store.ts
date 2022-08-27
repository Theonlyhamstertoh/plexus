import { nanoid } from "nanoid";
import React, { createRef } from "react";
import create from "zustand";
import { ShipHud, TILE_GAP, TILE_SIZE } from "../../App";
import AI from "../classes/AI";
import Coord from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import { PLAYER_COLORS, TileData } from "../types/types";

const gameboard = new Gameboard({ boardLength: [15, 20] });

const useGameStore = create<GameState>((set) => ({
  direction: false,
  hover: false,
  placingShip: false,
  playerData: {
    color: "",
    name: "",
  },
  grid: createTiles(),
  setGrid: () => set((state) => ({ grid: state.grid })),
}));

export default useGameStore;
interface GameState {
  direction: boolean;
  hover: boolean;
  placingShip: boolean;
  playerData: {
    color: string;
    name: string;
  };
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
        y: y * (50 + 5),
        x: x * (50 + 5),
      };
    }
  }
  return grid;
}
console.log("yes");
// ShipHud({ ships: gameboard.players[0].ships });
// let me see my ships on the left and my teammates
// keep track of all players and teammates too.
// data is simply sent. No one in the client. No data of other players should be stored there. Just information sent.
// I want to see my ship color
// every player will have their unique color stored
