import { atom } from "recoil";

export const goalConfigDisplayState = atom<boolean>({
  key: "goalConfigDisplayState",
  default: false,
});
