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
import messageActions from "./messages.js";

// VARIABLES
const app: UWS.TemplatedApp = UWS.App({});
const PORT = 3001;
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
      ws.gameBoardId = "";
      gameServer.totalSockets++;
    },

    message: (ws, message, isBinary) => messageActions(ws, message, gameServer),
    close: (ws, code, message) => {
      console.log("Websocket closed");
      const roomId = ws.gameRoomId;

      // remove socket from room
      const gameRoom: GameRoom | undefined = gameServer.getRoom(roomId);
      if (gameRoom === undefined) return new Error("No Room Found");
      gameRoom.removeSocket(ws.id);
      gameServer.totalSockets--;

      // cool leave message
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
  });
