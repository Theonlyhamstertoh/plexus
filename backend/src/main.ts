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
    GET_ALL_PLAYERS: "GET_ALL_PLAYERS",
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
};

// Clients Class
class Clients {
  lists: Map<string, UWS.WebSocket> = new Map();
}

// VARIABLES
const app: UWS.TemplatedApp = UWS.App({});
const PORT = 3001;
const clients = new Clients();
const decoder = new TextDecoder("utf-8");

// GAME VARIABLES
const gameServer = new GameServer();

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
    },

    message: (ws, message, isBinary) => messageActions(ws, message, gameServer),
    close: (ws, code, message) => {
      console.log("Websocket closed");
      // .removePlayerById(ws.id);
      console.log(clients.lists.size);
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
  });

function messageActions(ws: UWS.WebSocket, message_buffer: ArrayBuffer, gameServer: GameServer) {
  const client_msg = JSON.parse(decoder.decode(message_buffer));
  switch (client_msg.type) {
    case MESSAGE.PLAYER.SELF_CONNECTED: {
      ws.username = client_msg.username;
      ws.id = crypto.randomUUID();
      ws.roomId = "";
      break;
    }
    // room.addPlayer(ws, client_msg.username);
    // console.log(room.players.size);
    case MESSAGE.PLAYER.JOIN_PRIVATE_ROOM: {
      const gameRoom: GameRoom | undefined = gameServer.joinRoomByCode(client_msg.join_code);
      if (gameRoom === undefined) return ws.send(ROOM_NOT_FOUND_ERROR());
      gameRoom.addPlayerToRandomBoard(new Player(ws.username, ws.id));

      // subscribe to room topics
      ws.subscribe(gameRoom.id);
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
      break;
  }
}

const encode = (message: any) => JSON.stringify(message);
function ROOM_NOT_FOUND_ERROR() {
  return encode({ type: MESSAGE.ERROR.ROOM_NOT_FOUND, error: "ROOM NOT FOUND" });
}

interface MessageSchema {
  type: string;
  username?: string;
  join_code?: string;
  error?: string;
}
