import GameRoom from "../game/classes/GameRoom.js";
import { TextDecoder } from "util";
import GameServer from "./classes/GameServer.js";
import { WebSocket } from "uWebSockets.js";
import { MESSAGE } from "./types/types.js";
import { ERROR } from "./helpers/ERROR.js";
import { encode, exitRoom } from "./helpers/helpers.js";
import { SEND } from "./helpers/SEND.js";
const decoder = new TextDecoder("utf-8");

export default function messageActions(
  ws: WebSocket,
  message_buffer: ArrayBuffer,
  gameServer: GameServer
) {
  const client_msg = JSON.parse(decoder.decode(message_buffer));
  console.log(`SOCKET ${ws.number}`, client_msg);
  switch (client_msg.type) {
    case MESSAGE.PLAYER.SELF_CONNECTED: {
      if (ws.username.length > 0) return;
      ws.username = client_msg.username;
      break;
    }
    case MESSAGE.PLAYER.JOIN_PRIVATE_ROOM: {
      const gameRoom: GameRoom | undefined = gameServer.joinRoomByCode(client_msg.join_code);
      gameRoom;
      if (gameRoom === undefined) return ws.send(ERROR.ROOM_NOT_FOUND);
      if (gameRoom.getSocket(ws.id) !== undefined) return ws.send(ERROR.ROOM_ALREADY_JOIN);
      gameRoom.addSocket(ws);
      // subscribe to room topics
      ws.subscribe(gameRoom.id);
      ws.gameRoomId = gameRoom.id;

      // publish to every player in the room that player joined
      ws.publish(gameRoom.id, SEND.socket_data(ws.username, ws.id));
      // get all players in room
      ws.send(SEND.all_socket_data(gameRoom.sockets));
      break;
    }

    case MESSAGE.PLAYER.LEAVE_ROOM: {
      exitRoom(gameServer, ws);
      break;
    }
    /**
     *
     * ROOM CASES
     *
     */
    case MESSAGE.SERVER.CREATE_ROOM:
      // create a new game room
      const gameRoom = gameServer.createRoom();

      // send gameRoom data to host
      const msg = encode({ type: MESSAGE.ROOM.JOIN_CODE, join_code: gameRoom.join_code });
      ws.send(msg);
      console.log("ROOM CREATED", gameServer.rooms);
      break;

    /**
     *
     *
     *
     *
     *
     *
     * GAME CASES
     *
     *
     *
     *
     */
  }
}
``;
