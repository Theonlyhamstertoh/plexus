import { MESSAGE } from "../types/types.js";
import { encode } from "./helpers.js";

export const ERROR = {
  ROOM_NOT_FOUND: encode({ type: MESSAGE.ERROR.ROOM_NOT_FOUND }),
  ROOM_ALREADY_JOIN: encode({ type: MESSAGE.ERROR.ROOM_ALREADY_JOINED }),
  MULTIPLE_ROOM_WITH_SAME_JOIN_CODE: "",
};
