import Ship from "./game/classes/Ship.js";
import Gameboard from "./game/classes/Gameboard.js";
import Game from "./game/classes/Game.js";
import UWS from "uWebSockets.js";
import crypto from "crypto";
import { TextDecoder } from "util";
import { BOARD_SIZE } from "./game/types/types.js";

// Clients Class
class Clients {
  lists: Map<string, UWS.WebSocket> = new Map();
}

// VARIABLES
const app: UWS.TemplatedApp = UWS.App({});
const PORT = 3001;
const clients = new Clients();
const decoder = new TextDecoder("utf-8");

// FAKE GAMEBOARD ROOM
const CONFIG = {
  randomShips: false,
  boardLength: BOARD_SIZE.SMALL,
  shufflePlayerOrder: false,
  randomizeFirstTurn: false,
};
const game = new Game(CONFIG);
console.log(game.getRandomBoard().id);
app
  .ws("/*", {
    compression: UWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024,
    idleTimeout: 0,
    open: (ws) => {
      // Add Client WS to array
      ws.id = crypto.randomUUID();
      clients.lists.set(ws.id, ws);
      console.log("A Websocket connected!");
      console.log(clients.lists.size);
    },

    message: (ws, message, isBinary) => messageActions(ws, message, isBinary),
    close: (ws, code, message) => {
      console.log("Websocket closed");
      clients.lists.delete(ws.id);
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

function messageActions(ws: UWS.WebSocket, message_buffer: ArrayBuffer, isBinary: boolean) {
  const client_msg = JSON.parse(decoder.decode(message_buffer));
  switch (client_msg.type) {
    case MESSAGE.CLIENT.SELF_CONNECTED:
      console.log(client_msg);
  }
}

export const CHANNELS = {
  GAME_CHANNEL: "GAME_CHANNEL",
  CLIENT_CHANNEL: "CLIENT_CHANNEL",
  SERVER_CHANNEL: "SERVER_CHANNEL",
};

export const MESSAGE = {
  ROOM: {
    CREATE_ROOM: "CREATE_ROOM",
    REMOVE_ROOM: "REMOVE_ROOM",
    GET_ALL_ROOMS: "GET_ALL_ROOMS",
    GET_ALL_CLIENTS: "GET_ALL_CLIENTS",
    REMOVE_CLIENT: "REMOVE_CLIENT",
    ADD_CLIENT: "ADD_CLIENT",
  },
  CLIENT: {
    SELF_CONNECTED: "SELF_CONNECTED",
    CONNECTED: "CONNECTED",
    DISCONNECTED: "DISCONNECTED",
    JOIN_PUBLIC_ROOM: "JOIN_PUBLIC_ROOM",
    JOIN_PRIVATE_ROOM: "JOIN_PRIVATE_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
  },
};
// app.get("/*", (res, req) => {
//   res.writeStatus("200 OK").writeHeader("IsExample", "Yes").end("Hello there!");
// });
