import UWS from "uWebSockets.js";

export default class Player {
  // id: string = crypto.randomUUID();
  username: string;
  ws: UWS.WebSocket;
  constructor(ws: UWS.WebSocket, username: string) {
    this.ws = ws;
    this.username = username;
  }
}
