import Entity from "./Entity.js";
import Gameboard from "./Gameboard.js";

export default class Player extends Entity {
  constructor(name: string) {
    super(name);
  }

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: any) {
    if (coord === undefined) throw Error("UNDEFINED ATTACK COORD");

    return opponentBoard.receiveAttack(coord);
  }
}
