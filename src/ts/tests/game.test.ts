import { describe, beforeEach, afterEach, test, expect, vitest } from "vitest";
import Coord from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import { Game } from "../classes/GameController";
import Player from "../classes/Player";
import { BOARD_SIZE, CONFIG, GameBoardParams } from "../types/types";

describe("Game", () => {
  let game: Game;
  beforeEach(() => {
    CONFIG.boardLength = BOARD_SIZE.BIG;
    const teamOne = [
      new Player("Computer1", true),
      new Player("Computer2", true),
      new Player("Computer3", true),
    ];
    const teamTwo = [
      new Player("Computer1", true),
      new Player("Computer2", true),
      new Player("Computer3", true),
    ];
    game = new Game(CONFIG);
    // get the list of players from teams and put them into board
    game.gb[0].addPlayer(...teamOne);
    game.gb[1].addPlayer(...teamTwo);
  });

  afterEach(() => {
    vitest.restoreAllMocks();

    // resetting
    CONFIG.randomizeFirstTurn = false;
    CONFIG.shufflePlayerOrder = false;
    CONFIG.randomShips = false;
  });

  test("game should have created two gameboards", () => {
    expect(game.gb.length).toEqual(2);
  });

  test("gameboards should have a list of players each ", () => {
    expect(game.gb[0].players.length).toBeGreaterThan(0);
    expect(game.gb[1].players.length).toBeGreaterThan(0);
  });

  test("game should not randomize first turn", () => {
    expect(game.gb[game.currentBoard].id).toBe(game.gb[0].id);
  });

  test("game should randomize first turn", () => {
    vitest.spyOn(global.Math, "random").mockReturnValue(0.8);
    CONFIG.randomizeFirstTurn = true;
    const newGame = new Game(CONFIG);
    newGame.applyConfigs();
    expect(newGame.gb[newGame.currentBoard].id).toBe(newGame.gb[1].id);
  });

  test("game should pick the first player from current board ", () => {
    game.config.shufflePlayerOrder = true;
    game.config.randomizeFirstTurn = true;
    game.applyConfigs();

    expect(game.gb[game.currentBoard].getCurrentPlayer()).not.toBe(undefined);
  });

  test("current player attacks", () => {
    const currentPlayer = game.gb[game.currentBoard].getCurrentPlayer();
    populateGameWithShips(game);
    for (let i = 0; i < 50; i++) {
      currentPlayer.attack(game.getOpponentBoard());
    }
    console.log(game.getOpponentBoard().showBoard());
  });
  test.todo("if player attacks and miss, the turn is over");
  test.todo("if player attacks and hits, the next player in team has turn");
});

const populateGameWithShips = (game: Game) => {
  return game.gb.forEach((gb) =>
    gb.players.forEach((p) => p.ships.forEach((s) => gb.placeShipRandom(s)))
  );
};
