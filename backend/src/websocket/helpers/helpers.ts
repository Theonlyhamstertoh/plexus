import { TemplatedApp, WebSocket } from "uWebsockets.js";
import GameRoom from "../../game/classes/GameRoom.js";
import GameServer from "../classes/GameServer.js";
import { MessageSchema } from "../types/types.js";
import { SEND } from "./SEND.js";
export function exitRoom(gameServer: GameServer, ws: WebSocket, app?: TemplatedApp) {
  const gameRoom: GameRoom | undefined = gameServer.getRoom(ws.gameRoomId);
  if (gameRoom === undefined)
    return console.log("No Room Found: Player left without joining a room");
  gameRoom.removeSocket(ws.id);
  if (gameRoom.gameStarted) {
    gameRoom.getGameBoard(ws.gameBoardId).removePlayer(ws.id);
  }
  (app ?? ws).publish(gameRoom.id, SEND.socket_id(ws.id));

  // remove room if empty
  if (gameRoom.sockets.length === 0) {
    gameServer.removeRoom(gameRoom.id);
    console.log(gameServer.rooms);
  }
}

export const encode = (message: MessageSchema) => JSON.stringify(message);
