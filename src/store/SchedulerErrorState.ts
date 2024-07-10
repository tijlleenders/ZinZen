import { atom } from "recoil";

export const schedulerErrorState = atom({
  key: "schedulerErrorState",
  default: [] as string[],
});
