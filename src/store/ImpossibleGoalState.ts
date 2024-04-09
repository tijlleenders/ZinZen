import { ImpossibleGoalItem } from "@src/models/ImpossibleGoalItem";
import { atom } from "recoil";

export const displayImpossibleGoal = atom({
  key: "displayImpossibleGoal",
  default: [] as ImpossibleGoalItem[],
});
