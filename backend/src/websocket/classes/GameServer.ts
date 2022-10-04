import crypto from "crypto";
import { UrlWithStringQuery } from "url";
import UWS from "uWebSockets.js";
import { GameConfigs } from "../../game/types/types.js";
import GameRoom from "../../game/classes/GameRoom.js";

export default class GameServer {
  rooms: Map<string, GameRoom> = new Map();
  // sockets: Map<string, UWS.WebSocket> = new Map();
  readonly id = crypto.randomUUID();

  createRoom(config?: GameConfigs) {
    const newRoom: GameRoom = new GameRoom(config);
    this.rooms.set(newRoom.id, newRoom);
    return newRoom;
  }

  joinRoomById(id: string) {
    return this.rooms.get(id);
  }

  joinRoomByCode(join_code: string): GameRoom | undefined {
    for (const [_, gameRoom] of this.rooms) {
      if (gameRoom.join_code === join_code) {
        return gameRoom;
      }
    }
  }

  removeRoom(id: string) {
    this.rooms.delete(id);
  }

  removeAllRooms() {
    this.rooms.clear();
  }

  getRoom(id: string): GameRoom {
    // if (this.rooms.has(id)) {
    return this.rooms.get(id)!;
    // } else {
    // return new Error("NO ROOM FOUND");
    // }
  }

  getAllPublicRooms() {}
  getAllPrivateRooms() {}

  getRooms() {
    return this.rooms;
  }

  getSocket() {}

  removeSocket() {}
}
