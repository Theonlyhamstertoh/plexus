import Gameboard from "./Gameboard.js";
import { BoardLength, BOARD_SIZE, CONFIG, GameConfigs } from "../types/types.js";
import Player from "./Player.js";
import { customAlphabet, nanoid } from "nanoid";
import { UrlWithStringQuery } from "url";
import crypto from "crypto";
import { WebSocket } from "uWebSockets.js";
type BoardIndex = 0 | 1;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const MAX_SIZE = 12;

export default class GameRoom {
  gb: Gameboard[] = [];
  id: string = crypto.randomUUID();
  sockets: WebSocket[] = [];
  #currentBoardIndex: BoardIndex = 0;
  join_code: string = "123456";
  // join_code: string = customAlphabet(CHARS, 6)();
  config: GameConfigs;
  gameStarted: boolean = false;
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

  addPlayerToRandomBoard(player: Player) {
    this.getRandomBoard().addPlayer(player);
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

  getGameBoard(id: string): Gameboard {
    return this.gb.find((gb) => gb.id === id) as Gameboard;
  }

  checkWinner() {}
  checkIfOver() {}
  checkForDisconnect() {}

  // addToLobby(player: Player) {
  //   this.lobby.push(player);
  // }

  // removeFromLobby(playerId: string) {
  //   const player_index: number = this.lobby.findIndex((p) => p.id === playerId);
  //   if (player_index === -1) return "ERROR: PLAYER NOT FOUND IN LOBBY";
  //   this.lobby.splice(player_index, 1);
  // }

  addSocket(ws: WebSocket) {
    this.sockets.push(ws);
  }

  removeSocket(id: string) {
    const player_index: number = this.sockets.findIndex((p) => p.id === id);
    if (player_index === -1) return "ERROR: PLAYER NOT FOUND IN LOBBY";
    this.sockets.splice(player_index, 1);
  }

  getSocket(id: string): WebSocket | undefined {
    return this.sockets.find((ws) => ws.id === id);
  }

  clearSockets() {}
}
