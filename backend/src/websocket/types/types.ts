export const CHANNELS = {
  GAME_CHANNEL: "GAME_CHANNEL",
  PLAYER_CHANNEL: "CLIENT_CHANNEL",
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
    ROOM_ALREADY_JOINED: "ROOM_ALREADY_JOINED",
  },
  GAME: {},
  DATA: {
    GET_ALL_PLAYERS: "GET_ALL_PLAYERS",
  },
};

export interface MessageSchema {
  type: string;
  join_code?: string;
  error?: string;
  sockets?: SocketData[] | SocketData;
}

type SocketData = { username?: string; id?: string };

export interface GameData {}
