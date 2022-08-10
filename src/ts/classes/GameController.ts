import Gameboard from "./Gameboard";
import { BoardLength, BOARD_SIZE, CONFIG, GameBoardParams, GameConfigs } from "../types/types";
import Player from "./Player";
export class Store {}
type BoardIndex = 0 | 1;
export class Game {
  gb: Gameboard[] = [];
  #currentBoardIndex: BoardIndex = 0;
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
      this.#currentBoardIndex = Math.round(Math.random()) as BoardIndex;
    }
    return Math.random() > 0.5 ? 1 : 0;
  }

  getOpponentBoard() {
    return this.gb[1 - this.#currentBoardIndex];
  }

  nextTurn() {
    this.#currentBoardIndex = (1 - this.#currentBoardIndex) as BoardIndex;
  }

  startGame() {}

  resetGame() {}

  onPlayerDisconnect() {}

  getCurrentBoard() {
    return this.gb[this.#currentBoardIndex];
  }
}
