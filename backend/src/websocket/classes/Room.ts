import { customAlphabet, nanoid } from "nanoid";
import UWS from "uWebSockets.js";
import Player from "./Player.js";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const MAX_SIZE = 12;
export default class Room {
  id: string = crypto.randomUUID();
  players: Map<string, Player> = new Map();
  constructor(roomType: string) {}
}
