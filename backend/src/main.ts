import Ship from "./game/classes/Ship.js";
import Gameboard from "./game/classes/Gameboard.js";
import GameRoom from "./game/classes/GameRoom.js";
import UWS from "uWebSockets.js";
import crypto from "crypto";
import { TextDecoder } from "util";
import { BOARD_SIZE } from "./game/types/types.js";
import Room from "./websocket/classes/Room.js";
import GameServer from "./websocket/classes/GameServer.js";
import Player from "./game/classes/Player.js";
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
    CONNECTED_TO_ROOM: "CONNECTED_TO_ROOM",
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

// Clients Class
class Clients {
  lists: Map<string, WebSocket> = new Map();
}

// VARIABLES
const app: UWS.TemplatedApp = UWS.App({});
const PORT = 3001;
const clients = new Clients();
const decoder = new TextDecoder("utf-8");

// GAME VARIABLES
const gameServer = new GameServer();
gameServer.createRoom();

/**
 *
 *
 * Imagine we are a room. WS that connect, connect straight to room
 *
 *
 *
 */
app
  .ws("/*", {
    compression: UWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024,
    idleTimeout: 0,
    open: (ws) => {
      // We only get the WS. Data not received here.
      console.log("A Websocket connected!");
      ws.username = "";
      ws.id = crypto.randomUUID();
      ws.gameRoomId = "";
    },

    message: (ws, message, isBinary) => messageActions(ws, message, gameServer),
    close: (ws, code, message) => {
      console.log("Websocket closed");
      // .removePlayerById(ws.id);
      console.log(clients.lists.size);
      const roomId = ws.gameRoomId;
      const gameRoom = gameServer.getRoom(roomId);
      gameRoom.removeSocket(ws.id);
      console.log(
        "%c CLOSED ",
        "background: #111; color: #fa8a55; font-size: 15px; border-radius: 5px",
        gameRoom.sockets
      );
    },
  })
  .listen(PORT, (listenSocket) => {
    if (listenSocket) {
      console.clear();
      console.log(
        "%c Listening to port 3001 ",
        "background: #111; color: #bada55; font-size: 30px; border-radius: 5px"
      );
    } else {
      console.log("Failed to connect to port");
    }
  })
  .get("/*", (res, req) => {
    res.end("Hi");
  });

function messageActions(ws: WebSocket, message_buffer: ArrayBuffer, gameServer: GameServer) {
  const client_msg = JSON.parse(decoder.decode(message_buffer));
  console.log("SERVER-SIDE:", client_msg);
  switch (client_msg.type) {
    case MESSAGE.PLAYER.SELF_CONNECTED: {
      ws.username = client_msg.username;
      break;
    }
    // room.addPlayer(ws, client_msg.username);
    // console.log(room.players.size);
    case MESSAGE.PLAYER.JOIN_PRIVATE_ROOM: {
      const gameRoom: GameRoom | undefined = gameServer.joinRoomByCode(client_msg.join_code);
      gameRoom;
      if (gameRoom === undefined) return ws.send(ERROR.ROOM_NOT_FOUND);
      gameRoom.addSocket(ws);
      // subscribe to room topics
      ws.subscribe(gameRoom.id);
      ws.gameRoomId = gameRoom.id;
      // publish to every player in the room
      ws.publish(gameRoom.id, SEND.socket_data(ws.username, ws.id));

      // get all players in room
      ws.send(SEND.all_socket_data(gameRoom.sockets));
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
      const check = ws.send(msg);
      console.log("ROOM CREATED", check);
      break;
  }
}

const encode = (message: any) => JSON.stringify(message);
const SEND = (() => {
  function socket_data(username: string, id: string) {
    return encode({
      data: {
        username,
        id,
      },
    });
  }

  function all_socket_data(sockets: WebSocket[]) {
    const data = sockets.map(({ username, id }) => socket_data(username, id));
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
  username?: string;
  join_code?: string;
  error?: string;
}
