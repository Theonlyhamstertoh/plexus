import * as UWS from "uWebSockets.js";
declare module "uWebsockets.js" {
  export interface WebSocket extends UWS {
    username: string;
    id: string;
    gameRoomId: string;
  }
}
