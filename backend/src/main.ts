import Ship from "./classes/Ship.js";
import Gameboard from "./classes/Gameboard.js";

console.log(new Gameboard({ boardLength: [10, 10] }));

import UWS from "uWebSockets.js";

const app: UWS.TemplatedApp = UWS.App({});
app
  .get("/*", (res, req) => {
    res.writeStatus("200 OK").writeHeader("IsExample", "Yes").end("Hello there!");
  })
  .listen(3001, (listenSocket) => {
    if (listenSocket) console.log("Listening to port 3001");
  });
