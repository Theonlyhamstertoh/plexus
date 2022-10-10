import { useCallback, useEffect, useRef, useState } from "react";
import { MESSAGE } from "../../App";

const DEV_SERVER_URL = "ws://localhost:3001";
import { SessionCloseHandler, SessionMessageHandler, SessionConnectHandler } from "../types";
export default function useWebSocket(
  onOpen: SessionConnectHandler,
  onMessage: SessionMessageHandler,
  onClose: SessionCloseHandler
) {
  const [ws, setWS] = useState(null as unknown as WebSocket);

  const updateOpenHandler = () => {
    if (!ws) return;

    ws.addEventListener("open", onOpen);

    return () => ws.removeEventListener("open", onOpen);
  };

  const updateMessageHandler = () => {
    if (!ws) return;

    ws.addEventListener("message", onMessage);

    return () => ws.removeEventListener("message", onMessage);
  };
  const updateCloseHandler = () => {
    if (!ws) return;

    ws.addEventListener("close", onClose);

    return () => ws.removeEventListener("close", onClose);
  };

  const connect = (): WebSocket | undefined => {
    if (ws === null) {
      const socket: WebSocket = new WebSocket(DEV_SERVER_URL);
      setWS(socket);
      return socket;
    }
  };

  const sendMessage = <T>(data: T) => {
    ws.send(JSON.stringify(data));
  };
  const close = () => {
    // call this function if user navigate away from page
    if (ws === null) return;
    ws.close(1000);
    setWS(null as unknown as WebSocket);
  };

  useEffect(updateCloseHandler, [ws]);
  useEffect(updateMessageHandler, [ws]);
  useEffect(updateOpenHandler, [ws]);

  return { connect, sendMessage, close, ws };
}

const game_data = {
  type: "GAME_DATA",
  data: {
    configs: undefined,
    players: {
      teamOne: ["id", "id", "bot"],
      teamTwo: ["id", "id", "id"],
    },
  },
};
