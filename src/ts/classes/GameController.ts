import Gameboard from "./Gameboard";
import { BoardLength, BOARD_SIZE, CONFIG, GameBoardParams, GameConfigs } from "../types/types";
import Player from "./Player";
export class Game {
  gameboards: Gameboard[] = [];
  #currentBoard: Gameboard;

  constructor({ boardLength, randomizeFirstTurn }: GameConfigs) {
    CONFIG.boardLength = boardLength;
    this.gameboards.push(new Gameboard({ boardLength }), new Gameboard({ boardLength }));

    this.#currentBoard = this.gameboards[randomizeFirstTurn ? Math.round(Math.random()) : 0];
  }

  init() {}

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
