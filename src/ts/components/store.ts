import { nanoid } from "nanoid";
import React, { createRef } from "react";
import create from "zustand";
import { ShipHud } from "../../App";
import AI from "../classes/AI";
import Coord from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import { PLAYER_COLORS, TileData } from "../types/types";

export const TILE_SIZE = 50;
export const TILE_GAP = 5;
export const SMALL_TILE_GAP = 3;
export const SMALL_TILE_SIZE = 14;
export const GUIDE_SIZE = TILE_SIZE / 2;
export const CORNER_RADIUS = 0.16;

const useGameStore = create<GameState>((set) => ({
  direction: false,
  hover: false,
  placingShip: false,
  size: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  playerData: {
    color: "",
    name: "",
  },
  // grid: null,
  setSize: () =>
    set((state) => ({
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })),
  // setGrid: () => set((state) => ({ grid: state.grid })),
}));

export default useGameStore;
interface GameState {
  direction: boolean;
  hover: boolean;
  placingShip: boolean;
  size: {
    width: number;
    height: number;
  };
  playerData: {
    color: string;
    name: string;
  };
  // grid: TileData[][];
  // setGrid: () => void;
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

// all the gameboard data, game data will be stored on server side
// the data that should only be displayed here is the grid
// players information

// the grid is the main data. We need to update this constantly
// when user clicks something, we update it

console.log("yes");
// ShipHud({ ships: gameboard.players[0].ships });
// let me see my ships on the left and my teammates
// keep track of all players and teammates too.
// data is simply sent. No one in the client. No data of other players should be stored there. Just information sent.
// I want to see my ship color
// every player will have their unique color stored
