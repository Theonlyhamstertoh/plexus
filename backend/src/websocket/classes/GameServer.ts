import Room from "./Room.js";
import crypto from "crypto";
import { UrlWithStringQuery } from "url";
import UWS from "uWebSockets.js";
import GameRoom from "../../game/classes/GameRoom.js";
import { GameConfigs } from "../../game/types/types.js";

export default class GameServer {
  rooms: Map<string, Room> = new Map();
  sockets: Map<string, UWS.WebSocket> = new Map();
  readonly id = crypto.randomUUID();

  createRoom(config?: GameConfigs) {
    const newRoom: GameRoom = new GameRoom(config);
    return newRoom;
  }

  removeRoom(id: string) {
    this.rooms.delete(id);
  }

  removeAllRooms() {
    this.rooms.clear();
  }

  getRoom(id: string): Room {
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
