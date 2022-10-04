import crypto from "crypto";
import UWS from "uWebSockets.js";
import Player from "../../game/classes/Player";

export default class GameRooms {
  id: string = crypto.randomUUID();
  players: Map<string, Player> = new Map();

  addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  removePlayerById(id: string) {
    this.players.delete(id);
  }

  removeAllPlayers() {
    this.players.clear();
  }

  getPlayerByID(id: string) {
    return this.players.get(id);
  }

  removePlayerByUsername(username: string) {
    this.players.forEach((player, key) => player.username === username && this.players.delete(key));
  }
}

// ws will be stored in a Player class
// player.ws will be to access that
// room will hold player classes that have ws
// on ws close, we will find the ws.id and remove it. Thus, removing that player as well.
