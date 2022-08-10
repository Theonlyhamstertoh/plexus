import Gameboard from "./Gameboard";
import { BoardLength, BOARD_SIZE, CONFIG, GameBoardParams, GameConfigs } from "../types/types";
import Player from "./Player";
export class Store {}
export class Game {
  gb: Gameboard[] = [];
  #currentBoard: 0 | 1 = 0;
  config: GameConfigs;
  constructor(config: GameConfigs) {
    this.config = config;
    const { boardLength } = this.config;

    this.gb.push(new Gameboard({ boardLength }), new Gameboard({ boardLength }));
  }

  applyConfigs() {
    if (this.config.shufflePlayerOrder) {
      this.gb.forEach((gameboard) => gameboard.shufflePlayers());
    }
    if (this.config.randomizeFirstTurn) {
      this.#currentBoard = Math.random() > 0.5 ? 1 : 0;
    }
    return Math.random() > 0.5 ? 1 : 0;
  }

  getOpponentBoard() {
    return this.gb[1 - this.currentBoard];
  }

  startGame() {}

  resetGame() {}

  onPlayerDisconnect() {}

  get currentBoard() {
    return this.#currentBoard;
  }
}
