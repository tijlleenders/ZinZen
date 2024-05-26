import { ITask } from "@src/Interfaces/Task";
import { atom } from "recoil";

export const displayReschedule = atom({
  key: "displayReschedule",
  default: null as ITask | null,
});
