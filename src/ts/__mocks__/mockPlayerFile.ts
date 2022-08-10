import { vitest } from "vitest";

export const mockPlayerAttack = vitest.fn();
const mock = vitest.fn().mockImplementation(() => {
  return {
    attack: true,
  };
});
export default mock;
