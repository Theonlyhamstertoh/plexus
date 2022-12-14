import Ship from "./game/classes/Ship.js";
import Gameboard from "./game/classes/Gameboard.js";
import GameRoom from "./game/classes/GameRoom.js";
import UWS from "uWebSockets.js";
import crypto from "crypto";
import { TextDecoder } from "util";
import Room from "./websocket/classes/Room.js";
import GameServer from "./websocket/classes/GameServer.js";
import Player from "./game/classes/Player.js";
import messageActions from "./websocket/messages.js";
import { encode, exitRoom } from "./websocket/helpers/helpers.js";

// VARIABLES
const app: UWS.TemplatedApp = UWS.App({});
const PORT = 3001;

// GAME VARIABLES
const gameServer = new GameServer();
// gameServer.createRoom();

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
      ws.username = "";
      ws.id = crypto.randomUUID();
      ws.gameRoomId = "";
      ws.gameBoardId = "";
      gameServer.totalSockets++;
      ws.number = gameServer.totalSockets;

      ws.send("test");
      console.log(
        "%c SOCKET CONNECTED | Count: " + gameServer.totalSockets + "%c id: " + ws.id,
        "background: #111; color: #11cfa5; font-size: 15px; border-radius: 3px; padding-right: 2px",
        "background: #111; color: #cac2ff; font-size: 12px; border-radius: 2px; margin-left: 5px; padding: 0 5px;"
      );
    },

    message: (ws, message, isBinary) => messageActions(ws, message, gameServer),
    close: (ws, code, message) => {
      // remove socket from room
      // if player never joined a room, just exit out
      gameServer.totalSockets--;

      // cool leave message
      console.log(
        "%c WEBSOCKET CLOSED | Count: " + gameServer.totalSockets + "%c" + ws.username,
        "background: #111; color: #fa8a55; font-size: 15px; border-radius: 5px;  padding-right: 2px",
        "background: #111; border-radius: 2px; margin-left: 5px; padding: 0 5px;"
      );

      exitRoom(gameServer, ws, app);
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
