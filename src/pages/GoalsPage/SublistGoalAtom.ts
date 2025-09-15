import { GoalItem } from "@src/models/GoalItem";
import { atom } from "recoil";

export const selectedParentId = atom({
  key: "selectedParentId",
  default: [] as GoalItem[],
});
