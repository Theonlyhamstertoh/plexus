import { describe, beforeEach, afterEach, test, expect, vitest } from "vitest";
import Gameboard from "../classes/Gameboard";
import { Game } from "../classes/GameController";
import Player from "../classes/Player";
import { BOARD_SIZE, CONFIG } from "../types/types";

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
    game.gameboards[0].addPlayer(...teamOne);
    game.gameboards[1].addPlayer(...teamTwo);
  });

  afterEach(() => {
    vitest.restoreAllMocks();

    // resetting
    CONFIG.randomizeFirstTurn = false;
    CONFIG.shufflePlayerOrder = false;
    CONFIG.randomShips = false;
  });

  test("game should have created two gameboards", () => {
    expect(game.gameboards.length).toEqual(2);
  });

  test("gameboards should have a list of players each ", () => {
    expect(game.gameboards[0].players.length).toBeGreaterThan(0);
    expect(game.gameboards[1].players.length).toBeGreaterThan(0);
  });

  test("game should not randomize first turn", () => {
    expect(game.currentBoard.id).toBe(game.gameboards[0].id);
  });

  test("game should randomize first turn", () => {
    vitest.spyOn(global.Math, "random").mockReturnValue(1);
    CONFIG.randomizeFirstTurn = true;
    const newGame = new Game(CONFIG);
    newGame.applyConfigs();
    expect(newGame.currentBoard.id).toBe(newGame.gameboards[1].id);
  });

  test("game should pick the first player from current board ", () => {
    game.config.shufflePlayerOrder = true;
    game.config.randomizeFirstTurn = true;
    game.applyConfigs();

    expect(game.currentBoard.getCurrentPlayer()).not.toBe(undefined);
  });

  test.todo("if player attacks and miss, the turn is over");
  test.todo("if player attacks and hits, the next player in team has turn");
});
