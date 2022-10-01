import Ship from "./classes/Ship.js";
import Gameboard from "./classes/Gameboard.js";
import Game from "./classes/Game.js";
import UWS from "uWebSockets.js";
import crypto from "crypto";
import { BOARD_SIZE } from "./types/types.js";

// Clients Class
class Clients {
  lists: Map<string, UWS.WebSocket> = new Map();
}

// VARIABLES
const app: UWS.TemplatedApp = UWS.App({});
const PORT = 3001;
const clients = new Clients();

// FAKE GAMEBOARD ROOM
const CONFIG = {
  randomShips: false,
  boardLength: BOARD_SIZE.SMALL,
  shufflePlayerOrder: false,
  randomizeFirstTurn: false,
};
const game = new Game(CONFIG);
console.log(game.getRandomBoard().id);
app.ws("/*", {
  compression: UWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024,
  idleTimeout: 0,
  open: (ws) => {
    // Add Client WS to array
    ws.id = crypto.randomUUID();
    clients.lists.set(ws.id, ws);
    console.log("A Websocket connected!");
  },

  message: (ws, message, isBinary) => messageActions(ws, message, isBinary),
  close: (ws, code, message) => {
    console.log("Websocket closed");
  },
});

function messageActions(ws: UWS.WebSocket, message: ArrayBuffer, isBinary: boolean) {}

app
  .get("/*", (res, req) => {
    res.writeStatus("200 OK").writeHeader("IsExample", "Yes").end("Hello there!");
  })
  .listen(PORT, (listenSocket) => {
    if (listenSocket) {
      console.log("Listening to port 3001");
    } else {
      console.log("Failed to connect to port");
    }
  });
