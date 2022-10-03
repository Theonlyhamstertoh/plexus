import Gameboard from "./Gameboard.js";
import { BoardLength, BOARD_SIZE, CONFIG, GameConfigs } from "../types/types.js";
import Player from "./Player.js";
export class Store {}
type BoardIndex = 0 | 1;

export default class GameRoom {
  gb: Gameboard[] = [];
  #currentBoardIndex: BoardIndex = 0;
  config: GameConfigs;
  constructor(customConfig?: GameConfigs) {
    this.config = customConfig !== undefined ? customConfig : CONFIG;
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

  nextTurn(isHit: boolean) {
    // move turn to next player
    // if player miss, switch board
    if (isHit === false) {
      this.#currentBoardIndex = (1 - this.#currentBoardIndex) as BoardIndex;
    }
    this.getCurrentBoard().nextTeammate();
  }

  addBot() {}
  startGame() {}

  resetGame() {}

  onPlayerDisconnect() {}

  getCurrentBoard() {
    return this.gb[this.#currentBoardIndex];
  }

  getRandomBoard() {
    return this.gb[Math.round(Math.random())];
  }

  checkWinner() {}
  checkIfOver() {}
  checkForDisconnect() {}
}
