import GameRoom from "./game/classes/GameRoom.js";
import { TextDecoder } from "util";
import GameServer from "./websocket/classes/GameServer.js";
import { WebSocket } from "uWebSockets.js";
export const CHANNELS = {
  GAME_CHANNEL: "GAME_CHANNEL",
  PLAYER_CHANNEL: "CLIENT_CHANNEL",
  SERVER_CHANNEL: "SERVER_CHANNEL",
};

export const MESSAGE = {
  SERVER: {
    GET_ALL_ROOMS: "GET_ALL_ROOMS",
    CREATE_ROOM: "CREATE_ROOM",
    REMOVE_ROOM: "REMOVE_ROOM",
  },

  ROOM: {
    REMOVE_PLAYER: "REMOVE_PLAYER",
    ADD_PLAYER: "ADD_PLAYER",
    JOIN_CODE: "JOIN_CODE",
  },
  PLAYER: {
    SELF_CONNECTED: "SELF_CONNECTED",
    CONNECTED_TO_ROOM: "CONNECTED_TO_ROOM", // for incoming player
    DISCONNECTED: "DISCONNECTED",
    JOIN_PUBLIC_ROOM: "JOIN_PUBLIC_ROOM",
    JOIN_PRIVATE_ROOM: "JOIN_PRIVATE_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
  },
  ERROR: {
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  },
  GAME: {},
  DATA: {
    GET_ALL_PLAYERS: "GET_ALL_PLAYERS",
  },
};

const decoder = new TextDecoder("utf-8");

export default function messageActions(
  ws: WebSocket,
  message_buffer: ArrayBuffer,
  gameServer: GameServer
) {
  const client_msg = JSON.parse(decoder.decode(message_buffer));
  console.log("SERVER-SIDE:", client_msg);
  switch (client_msg.type) {
    case MESSAGE.PLAYER.SELF_CONNECTED: {
      ws.username = client_msg.username;
      break;
    }
    case MESSAGE.PLAYER.JOIN_PRIVATE_ROOM: {
      const gameRoom: GameRoom | undefined = gameServer.joinRoomByCode(client_msg.join_code);
      gameRoom;
      if (gameRoom === undefined) return ws.send(ERROR.ROOM_NOT_FOUND);
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
      const gameRoom: GameRoom | undefined = gameServer.getRoom(ws.gameRoomId);
      if (gameRoom === undefined) return new Error("No Room Found");
      gameRoom.removeSocket(ws.id);
      if (gameRoom.gameStarted) {
        gameRoom.getGameBoard(ws.gameBoardId).removePlayer(ws.id);
      }
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
      const check = ws.send(msg);
      console.log("ROOM CREATED", check);
      break;
  }
}

const encode = (message: MessageSchema) => JSON.stringify(message);
const SEND = (() => {
  function socket_data(username: string, id: string) {
    return encode({
      type: MESSAGE.PLAYER.CONNECTED_TO_ROOM,
      data: { username, id },
    });
  }

  function all_socket_data(sockets: WebSocket[]) {
    const data = sockets.map(({ username, id }) => ({ username, id }));
    return encode({ type: MESSAGE.DATA.GET_ALL_PLAYERS, data });
  }

  return {
    socket_data,
    all_socket_data,
  };
})();

const ERROR = {
  ROOM_NOT_FOUND: encode({ type: MESSAGE.ERROR.ROOM_NOT_FOUND, error: "ROOM NOT FOUND" }),
};

interface MessageSchema {
  type: string;
  join_code?: string;
  error?: string;
  data?: SocketData | SocketData[];
}

type SocketData = { username?: string; id?: string };

interface GameData {}
