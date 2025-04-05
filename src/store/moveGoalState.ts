import { GoalItem } from "@src/models/GoalItem";
import { atom } from "recoil";

export const moveGoalState = atom({
  key: "moveGoalState",
  default: null as GoalItem | null,
});
