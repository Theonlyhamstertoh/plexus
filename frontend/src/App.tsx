import { faker } from "@faker-js/faker";
import { useMemo, useState } from "react";

export const CHANNELS = {
  GAME_CHANNEL: "GAME_CHANNEL",
  CLIENT_CHANNEL: "CLIENT_CHANNEL",
  SERVER_CHANNEL: "SERVER_CHANNEL",
};

export const MESSAGE = {
  SERVER: {
    GET_ALL_ROOMS: "GET_ALL_ROOMS",
    CREATE_ROOM: "CREATE_ROOM",
    REMOVE_ROOM: "REMOVE_ROOM",
  },

  ROOM: {
    REMOVE_PLAYER: "REMOVE_PLAYER",
    ADD_PLAYER: "ADD_PLAYER",
    JOIN_CODE: "JOIN_CODE",
  },
  PLAYER: {
    SELF_CONNECTED: "SELF_CONNECTED",
    CONNECTED_TO_ROOM: "CONNECTED_TO_ROOM", // for incoming player
    DISCONNECTED: "DISCONNECTED_FROM_ROOM",
    JOIN_PUBLIC_ROOM: "JOIN_PUBLIC_ROOM",
    JOIN_PRIVATE_ROOM: "JOIN_PRIVATE_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
  },
  ERROR: {
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  },
  GAME: {},
  DATA: {
    GET_ALL_PLAYERS: "GET_ALL_PLAYERS",
  },
};

/**
 *
 * Websocket
 *
 */

const DEV_SERVER_URL = "ws://localhost:3001";
const decoder = new TextDecoder();

var ws = new WebSocket(DEV_SERVER_URL);
ws.onmessage = (ev) => {
  console.log(JSON.parse(ev.data));
};
ws.addEventListener("open", () => {
  ws.binaryType = "arraybuffer";

  // Imagine this as data they enter before game
  const message = {
    type: MESSAGE.PLAYER.SELF_CONNECTED,
    username: faker.internet.emoji(),
  };
  ws.send(JSON.stringify(message));

  // we will create a room here
  // const create_a_room = {
  //   type: MESSAGE.ROOM.CREATE_ROOM,
  // };
  // ws.send(JSON.stringify(create_a_room));

  // join a room here~
  // ws.send(JSON.stringify({ type: MESSAGE.PLAYER.JOIN_PRIVATE_ROOM, join_code: "123456" }));
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
export default function App() {
  const [roomCode, setRoomCode] = useState("");

  const disconnectFromRoom = () => ws.send(JSON.stringify({ type: MESSAGE.PLAYER.LEAVE_ROOM }));
  const createRoom = () => ws.send(JSON.stringify({ type: MESSAGE.SERVER.CREATE_ROOM }));
  const joinRoom = () =>
    ws.send(JSON.stringify({ type: MESSAGE.PLAYER.JOIN_PRIVATE_ROOM, join_code: roomCode }));
  return (
    <div>
      <button onClick={disconnectFromRoom}>Leave Room</button>
      <button onClick={createRoom}>Create Room</button>

      <div>
        <input
          type="text"
          value={roomCode}
          onChange={({ target }: { target: HTMLInputElement }) => {
            setRoomCode(target.value);
          }}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      <div>
        <div>Join Code: {roomCode}</div>
      </div>
    </div>
  );
}
