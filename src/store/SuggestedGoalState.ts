import { GoalItem } from "@src/models/GoalItem";
import { atom } from "recoil";

export const suggestedGoalState = atom({
  default: null as GoalItem | null,
  key: "SuggestedGoal",
});
