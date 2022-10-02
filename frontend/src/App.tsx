export default function App() {
  return <div>Empty</div>;
}

const CHANNELS = {
  GAME_CHANNEL: "GAME_CHANNEL",
  CLIENT_CHANNEL: "CLIENT_CHANNEL",
  SERVER_CHANNEL: "SERVER_CHANNEL",
};

const MESSAGE = {
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

/**
 *
 * Websocket
 *
 */

const DEV_SERVER_URL = "ws://localhost:3001";
const ws = new WebSocket(DEV_SERVER_URL);

ws.addEventListener("open", () => {
  ws.binaryType = "arraybuffer";
  const message = {
    type: MESSAGE.CLIENT.SELF_CONNECTED,
    name: "weibo",
  };
  ws.send(JSON.stringify(message));
});
