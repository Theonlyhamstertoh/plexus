import Ship from "./classes/Ship.js";
import Gameboard from "./classes/Gameboard.js";
import UWS from "uWebSockets.js";
import crypto from "crypto";

// Clients Class
class Clients {
  lists: Map<string, UWS.WebSocket> = new Map();
}

// VARIABLES
const PORT = 3001;
const clients = new Clients();

const app: UWS.TemplatedApp = UWS.App({});
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

app.ws("/*", {
  compression: UWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024,
  idleTimeout: 0,
  open: (ws) => {
    // Add Client WS to array
    ws.id = crypto.randomUUID();
    clients.lists.set(ws.id, ws);
    console.log("A Websocket connected!");
    console.log(clients.lists);
  },

  message: (ws, message, isBinary) => messageActions(ws, message, isBinary),
  close: (ws, code, message) => {
    console.log("Websocket closed");
  },
});

function messageActions(ws: UWS.WebSocket, message: ArrayBuffer, isBinary: boolean) {}
