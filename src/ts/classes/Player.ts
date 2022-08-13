import { AttackCoordData } from "../types/types";
import Entity from "./Entity";
import Gameboard from "./Gameboard";

export default class Player extends Entity {
  constructor(name: string) {
    super(name);
  }

  attack(opponentBoard: Gameboard, board: Gameboard, coord?: any): AttackCoordData {
    if (coord === undefined) throw Error("UNDEFINED ATTACK COORD");
    const isHit = opponentBoard.receiveAttack(coord);
    return { coord, hit: isHit };
  }
}
