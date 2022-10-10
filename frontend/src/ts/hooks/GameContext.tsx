import { useEffect, useLayoutEffect, useState } from "react";
import { MESSAGE } from "../../App";
import { SessionSendMessage } from "../types";
import useWebSocket from "./useWebsocket";
const decoder = new TextDecoder();

function wsConnectHandler(e: Event): any {}
function wsMessageHandler<T>(e: MessageEvent<T>): any {
  console.log("DATA SENT:", e.data);
  // console.log(JSON.parse(decoder.decode(e.data)));
}
function wsDisconnectHandler<T>(e: Event): any {
  // Disconnect Handler called if session closed on server-side
  console.log("Disconnect Handler");
}

export default function GameContext() {
  const { connect, sendMessage, close, ws } = useWebSocket(
    wsConnectHandler,
    wsMessageHandler,
    wsDisconnectHandler
  );
  useEffect(() => {
    // const socket: WebSocket | undefined = connect();
    // return () => socket && close();
  }, []);

  // return null;
  return (
    <>
      <div>
        <span>SESSION:</span>
        <button onClick={connect}>Create Session </button>
        <button
          onClick={() => sendMessage({ type: MESSAGE.PLAYER.SELF_CONNECTED, username: "weibo" })}
        >
          Self connect
        </button>
        <button onClick={close}>End Session </button>
      </div>
      <div>
        <span>ROOM:</span>
        <button onClick={() => sendMessage({ type: MESSAGE.SERVER.CREATE_ROOM })}>
          Create Room
        </button>
        <JoinRoom sendMessage={sendMessage} />
        <button onClick={() => sendMessage({ type: MESSAGE.PLAYER.LEAVE_ROOM })}>Leave Room</button>
      </div>
    </>
  );
}

function JoinRoom({ sendMessage }: { sendMessage: SessionSendMessage }) {
  const [joinCode, setJoinCode] = useState("");
  return (
    <span>
      <input onChange={(e) => setJoinCode(e.target.value)} value={joinCode} type="text" />
      <button
        onClick={() => sendMessage({ type: MESSAGE.PLAYER.JOIN_PRIVATE_ROOM, join_code: joinCode })}
      >
        Join Room
      </button>
    </span>
  );
}
