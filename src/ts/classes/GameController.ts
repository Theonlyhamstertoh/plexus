import Gameboard from "./Gameboard";
import { BoardLength, BOARD_SIZE, CONFIG, GameBoardParams, GameConfigs } from "../types/types";
import Player from "./Player";
export class Store {}
export class Game {
  gameboards: Gameboard[] = [];
  #currentBoard: Gameboard;
  config: GameConfigs;
  constructor(config: GameConfigs) {
    this.config = config;
    const { boardLength, randomizeFirstTurn } = this.config;

    this.gameboards.push(new Gameboard({ boardLength }), new Gameboard({ boardLength }));
    this.#currentBoard = this.gameboards[0];
  }

  applyConfigs() {
    if (this.config.shufflePlayerOrder) {
      this.gameboards.forEach((gameboard) => gameboard.shufflePlayers());
    }
    if (this.config.randomizeFirstTurn) {
      this.#currentBoard = this.gameboards[Math.round(Math.random())];
    }
  }

  startGame() {}

  resetGame() {}

  onPlayerDisconnect() {}

  get currentBoard() {
    return this.#currentBoard;
  }
}

// start a new game when host clicks start
const game = new Game({ boardLength: BOARD_SIZE.BIG });
const teamOne = [new Player("Computer", true), new Player("Computer", true)];
const teamTwo = [new Player("Computer", true), new Player("Computer", true)];
// get the list of players from teams and put them into board
game.gameboards[0].addPlayer(...teamOne);
game.gameboards[1].addPlayer(...teamTwo);
