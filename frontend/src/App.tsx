export default function App() {
  return <div>Empty</div>;
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
    CONNECTED_TO_ROOM: "CONNECTED_TO_ROOM",
    DISCONNECTED: "DISCONNECTED",
    JOIN_PUBLIC_ROOM: "JOIN_PUBLIC_ROOM",
    JOIN_PRIVATE_ROOM: "JOIN_PRIVATE_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
  },
};

/**
 *
 * Websocket
 *
 */

const DEV_SERVER_URL = "ws://localhost:3001";
const ws = new WebSocket(DEV_SERVER_URL);

ws.addEventListener("open", () => {
  ws.binaryType = "arraybuffer";

  // Imagine this as data they enter before game
  const message = {
    type: MESSAGE.CLIENT.SELF_CONNECTED,
    username: "weibo",
  };
  ws.send(JSON.stringify(message));

  // we will create a room here
  const create_a_room = {
    type: MESSAGE.ROOM.CREATE_ROOM,
  };
  ws.send(JSON.stringify(create_a_room));

  // join a room here
  ws.send(JSON.stringify({ type: MESSAGE.CLIENT.CONNECTED_TO_ROOM }));
});
