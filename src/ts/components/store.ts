import React, { createRef } from "react";
import create from "zustand";
import Coord from "../classes/Coord";
const useGameStore = create<GameState>()((set: any) => ({
  direction: false,
  hover: false,
  placingShip: null,
  grid: [],

  // lastPosition: createRef<Coord>() as React.MutableRefObject<Coord>,
}));

export default useGameStore;
interface GameState {}

//Based on the current ship clicked
//  the ship length
//  direction
//  follow mouse position
