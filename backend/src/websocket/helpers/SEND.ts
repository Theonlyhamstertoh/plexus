import { WebSocket } from "uWebsockets.js";
import { MESSAGE } from "../types/types.js";
import { encode } from "./helpers.js";

export const SEND = (() => {
  function socket_data(username: string, id: string) {
    return encode({
      type: MESSAGE.PLAYER.CONNECTED_TO_ROOM,
      sockets: { username, id },
    });
  }

  function all_socket_data(data: WebSocket[]) {
    const sockets = data.map(({ username, id }) => ({ username, id }));
    return encode({ type: MESSAGE.DATA.GET_ALL_PLAYERS, sockets });
  }

  const socket_id = (id: string) => encode({ type: MESSAGE.PLAYER.DISCONNECTED, sockets: { id } });
  return {
    socket_data,
    all_socket_data,
    socket_id,
  };
})();
