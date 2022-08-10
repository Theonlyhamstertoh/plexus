import { describe, beforeEach, afterEach, test, expect, vitest, vi } from "vitest";
import Coord from "../classes/Coord";
import Gameboard from "../classes/Gameboard";
import { Game } from "../classes/GameController";
import Player from "../classes/Player";
import { BOARD_SIZE, CONFIG, GameBoardParams, MARKS } from "../types/types";
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
    populateGameWithShips(game);
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
    expect(game.getCurrentBoard().id).toBe(game.gb[0].id);
  });

  test("game should randomize first turn", () => {
    vitest.spyOn(global.Math, "random").mockReturnValue(0.8);
    CONFIG.randomizeFirstTurn = true;
    const newGame = new Game(CONFIG);
    newGame.applyConfigs();
    expect(newGame.getCurrentBoard().id).toBe(newGame.gb[1].id);
  });

  test("game should pick the first player from current board ", () => {
    game.config.shufflePlayerOrder = true;
    game.config.randomizeFirstTurn = true;
    game.applyConfigs();

    expect(game.getCurrentBoard().getCurrentPlayer()).not.toBe(undefined);
  });

  test("current bot attacks board", () => {
    const currentPlayer = game.getCurrentBoard().getCurrentPlayer();
    //prettier-ignore
    const {coord: {y, x}} = currentPlayer.computerAttack(game.getOpponentBoard());
    expect(game.getOpponentBoard().grid[y][x]).not.toBe(MARKS.WATER);
    expect(game.getOpponentBoard().grid[y][x]).not.toBe(MARKS.SHIP);
  });

  test("ship should take damage if hit");

  test.todo("if attack hits, receiveAttack should return true");
  test("if player attacks and miss, the turn is over", () => {
    const currentBoard = game.getCurrentBoard();
    const currentPlayer = currentBoard.getCurrentPlayer();
    const { hit } = currentPlayer.attack(game.getOpponentBoard(), new Coord(2, 0));
    !hit && game.nextTurn();
    expect(game.getCurrentBoard()).not.toBe(currentBoard);
  });
  test("if player hits, next player in team has turn", () => {
    const currentPlayer = game.getCurrentBoard().getCurrentPlayer();
    const { hit } = currentPlayer.attack(game.getOpponentBoard(), new Coord(0, 0));
    hit && game.getCurrentBoard().moveCurrentPlayerToLast();
    expect(game.getCurrentBoard().getCurrentPlayer()).not.toBe(currentPlayer);
  });
});

// const populateGameRandomly = (game: Game) => {
//   return game.gb.forEach((gb) =>
//     gb.players.forEach((p) => p.ships.forEach((s) => gb.placeShipRandom(s)))
//   );
// };

const populateGameWithShips = (game: Game) => {
  return game.gb.forEach((gb) =>
    gb.players.forEach((p, i) => {
      p.ships.forEach((s, j) => {
        gb.placeShip(new Coord(j + j * 2, i + i * 5), "right", s);
      });
    })
  );
};
