import Coord from "../classes/Coord";
import GameRoom from "../classes/GameRoom";
import Player from "../classes/Player";
import Ship from "../classes/Ship";
import { BOARD_SIZE, CONFIG, MARKS } from "../types/types";
import AI from "../classes/AI";
import { test, expect, describe, beforeEach, afterEach, vitest } from "vitest";

describe("gameRoom", () => {
  let gameRoom: GameRoom;
  beforeEach(() => {
    CONFIG.boardLength = BOARD_SIZE.BIG;
    const teamOne = [new Player("player1"), new AI("bot2"), new AI("bot3")];
    const teamTwo = [new Player("player4"), new AI("bot5"), new AI("bot6")];
    gameRoom = new GameRoom(CONFIG);
    // get the list of players from teams and put them into board
    gameRoom.gb[0].addPlayer(...teamOne);
    gameRoom.gb[1].addPlayer(...teamTwo);
    populategameRoomWithShips(gameRoom);
  });

  afterEach(() => {
    vitest.restoreAllMocks();

    // resetting
    CONFIG.randomizeFirstTurn = false;
    CONFIG.shufflePlayerOrder = false;
    CONFIG.randomShips = false;
    CONFIG.boardLength = BOARD_SIZE.SMALL;
  });

  test("gameRoom should have created two gameRoomboards", () => {
    expect(gameRoom.gb.length).toEqual(2);
  });

  test("gameRoomboards should have a list of players each ", () => {
    expect(gameRoom.gb[0].players.length).toBeGreaterThan(0);
    expect(gameRoom.gb[1].players.length).toBeGreaterThan(0);
  });

  test("gameRoom should not randomize first turn", () => {
    expect(gameRoom.getCurrentBoard().id).toBe(gameRoom.gb[0].id);
  });

  test("gameRoom should randomize first turn", () => {
    vitest.spyOn(global.Math, "random").mockReturnValue(0.8);
    const newgameRoom = new GameRoom(CONFIG);
    newgameRoom.config.randomizeFirstTurn = true;
    newgameRoom.applyConfigs();
    expect(newgameRoom.getCurrentBoard().id).toBe(newgameRoom.gb[1].id);
  });

  test("gameRoom should pick the first player from current board ", () => {
    gameRoom.config.shufflePlayerOrder = true;
    gameRoom.config.randomizeFirstTurn = true;
    gameRoom.applyConfigs();

    expect(gameRoom.getCurrentBoard().getCurrentPlayer()).not.toBe(undefined);
  });

  test("current bot attacks board", () => {
    // move "player1" back so that "bot2" is first
    gameRoom.getCurrentBoard().nextTeammate();
    const currentPlayer = gameRoom.getCurrentBoard().getCurrentPlayer();
    //prettier-ignore
    const prevNotHitCoords = gameRoom.getOpponentBoard().notHitCoords.length
    currentPlayer.attack(gameRoom.getOpponentBoard(), gameRoom.getCurrentBoard())!;
    expect(gameRoom.getOpponentBoard().notHitCoords.length).toBeLessThan(prevNotHitCoords);
  });

  test("if player attacks and miss, the turn is over", () => {
    const currentBoard = gameRoom.getCurrentBoard();
    const currentPlayer = currentBoard.getCurrentPlayer();
    const hit = currentPlayer.attack(
      gameRoom.getOpponentBoard(),
      gameRoom.getCurrentBoard(),
      new Coord(2, 0)
    );
    gameRoom.nextTurn(hit);
    expect(gameRoom.getCurrentBoard().id).not.toBe(currentBoard.id);
  });
  test("if player hits, next player in team has turn", () => {
    const currentPlayer = gameRoom.getCurrentBoard().getCurrentPlayer();
    const hit = currentPlayer.attack(
      gameRoom.getOpponentBoard(),
      gameRoom.getCurrentBoard(),
      new Coord(0, 0)
    );
    // console.log(gameRoom.getOpponentBoard().findShip(new Coord(0, 0)));
    gameRoom.nextTurn(hit);
    expect(gameRoom.getCurrentBoard().getCurrentPlayer()).not.toBe(currentPlayer);
  });

  test("get board state", () => {
    CONFIG.boardLength = BOARD_SIZE.BIG;
    const newgameRoom = new GameRoom(CONFIG);
    const teamOne = [new Player("player1"), new AI("bot2"), new AI("bot3")];
    const teamTwo = [new Player("player4"), new AI("bot5"), new AI("bot6")];
    newgameRoom.gb[0].addPlayer(...teamOne);
    newgameRoom.gb[1].addPlayer(...teamTwo);
    newgameRoom.config.shufflePlayerOrder = false;
    populategameRoomRandomly(newgameRoom);
    newgameRoom.getCurrentBoard().nextTeammate();
    for (let i = 0; i < 50; i++) {
      newgameRoom
        .getCurrentBoard()
        .getCurrentPlayer()
        .attack(newgameRoom.getOpponentBoard(), newgameRoom.getCurrentBoard(), i);
    }
    expect(newgameRoom.getOpponentBoard().getBoardState().shipsAlive).toBeGreaterThan(0);
  });
});

const populategameRoomRandomly = (gameRoom: GameRoom) => {
  return gameRoom.gb.forEach((gb) =>
    gb.players.forEach((p) => p.ships.forEach((s) => gb.placeShipRandom(s)))
  );
};

const populategameRoomWithShips = (gameRoom: GameRoom) => {
  return gameRoom.gb.forEach((gb) =>
    gb.players.forEach((p, i) => {
      p.ships.forEach((s: Ship, j: number) => {
        gb.placeShip(new Coord(j + j * 2, i + i * 5), "right", s);
      });
    })
  );
};
