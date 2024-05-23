import { atom } from "recoil";

export const schedulerErrorState = atom({
  key: "schedulerErrorState",
  default: null as string | null,
});

export const schedulerErrorModalShown = atom({
  key: "schedulerErrorModalShown",
  default: false,
});
