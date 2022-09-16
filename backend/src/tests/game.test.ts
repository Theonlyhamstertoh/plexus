import Coord from "../classes/Coord";
import { Game } from "../classes/GameController";
import Player from "../classes/Player";
import Ship from "../classes/Ship";
import { BOARD_SIZE, CONFIG, MARKS } from "../types/types";
import AI from "../classes/AI";
describe("Game", () => {
  let game: Game;
  beforeEach(() => {
    CONFIG.boardLength = BOARD_SIZE.BIG;
    const teamOne = [new Player("player1"), new AI("bot2"), new AI("bot3")];
    const teamTwo = [new Player("player4"), new AI("bot5"), new AI("bot6")];
    game = new Game(CONFIG);
    // get the list of players from teams and put them into board
    game.gb[0].addPlayer(...teamOne);
    game.gb[1].addPlayer(...teamTwo);
    populateGameWithShips(game);
  });

  afterEach(() => {
    jest.restoreAllMocks();

    // resetting
    CONFIG.randomizeFirstTurn = false;
    CONFIG.shufflePlayerOrder = false;
    CONFIG.randomShips = false;
    CONFIG.boardLength = BOARD_SIZE.SMALL;
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
    jest.spyOn(global.Math, "random").mockReturnValue(0.8);
    const newGame = new Game(CONFIG);
    newGame.config.randomizeFirstTurn = true;
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
    // move "player1" back so that "bot2" is first
    game.getCurrentBoard().nextTeammate();
    const currentPlayer = game.getCurrentBoard().getCurrentPlayer();
    //prettier-ignore
    const prevNotHitCoords = game.getOpponentBoard().notHitCoords.length
    currentPlayer.attack(game.getOpponentBoard(), game.getCurrentBoard())!;
    expect(game.getOpponentBoard().notHitCoords.length).toBeLessThan(prevNotHitCoords);
  });

  test("if player attacks and miss, the turn is over", () => {
    const currentBoard = game.getCurrentBoard();
    const currentPlayer = currentBoard.getCurrentPlayer();
    const hit = currentPlayer.attack(
      game.getOpponentBoard(),
      game.getCurrentBoard(),
      new Coord(2, 0)
    );
    game.nextTurn(hit);
    expect(game.getCurrentBoard().id).not.toBe(currentBoard.id);
  });
  test("if player hits, next player in team has turn", () => {
    const currentPlayer = game.getCurrentBoard().getCurrentPlayer();
    const hit = currentPlayer.attack(
      game.getOpponentBoard(),
      game.getCurrentBoard(),
      new Coord(0, 0)
    );
    // console.log(game.getOpponentBoard().findShip(new Coord(0, 0)));
    game.nextTurn(hit);
    expect(game.getCurrentBoard().getCurrentPlayer()).not.toBe(currentPlayer);
  });

  test("get board state", () => {
    CONFIG.boardLength = BOARD_SIZE.BIG;
    const newGame = new Game(CONFIG);
    const teamOne = [new Player("player1"), new AI("bot2"), new AI("bot3")];
    const teamTwo = [new Player("player4"), new AI("bot5"), new AI("bot6")];
    newGame.gb[0].addPlayer(...teamOne);
    newGame.gb[1].addPlayer(...teamTwo);
    newGame.config.shufflePlayerOrder = false;
    populateGameRandomly(newGame);
    newGame.getCurrentBoard().nextTeammate();
    for (let i = 0; i < 50; i++) {
      newGame
        .getCurrentBoard()
        .getCurrentPlayer()
        .attack(newGame.getOpponentBoard(), newGame.getCurrentBoard(), i);
    }
    expect(newGame.getOpponentBoard().getBoardState().shipsAlive).toBeGreaterThan(0);
  });
});

const populateGameRandomly = (game: Game) => {
  return game.gb.forEach((gb) =>
    gb.players.forEach((p) => p.ships.forEach((s) => gb.placeShipRandom(s)))
  );
};

const populateGameWithShips = (game: Game) => {
  return game.gb.forEach((gb) =>
    gb.players.forEach((p, i) => {
      p.ships.forEach((s: Ship, j: number) => {
        gb.placeShip(new Coord(j + j * 2, i + i * 5), "right", s);
      });
    })
  );
};
