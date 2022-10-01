import Ship from "./classes/Ship.js";
import Gameboard from "./classes/Gameboard.js";

console.log(new Gameboard({ boardLength: [10, 10] }));

import UWS from "uWebSockets.js";

const PORT = 3001;
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
    console.log("A Websocket connected!");
  },

  message: (ws, message, isBinary) => messageActions(ws, message, isBinary),
  close: (ws, code, message) => {
    console.log("Websocket closed");
  },
});

function messageActions(ws: UWS.WebSocket, message: ArrayBuffer, isBinary: boolean) {}
