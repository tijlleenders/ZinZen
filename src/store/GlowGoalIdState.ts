import { atom } from "recoil";

export const glowGoalIdState = atom<string | null>({
  key: "glowGoalIdState",
  default: "",
});
