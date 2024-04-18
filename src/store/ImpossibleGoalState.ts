import { ImpossibleGoalItem } from "@src/models/ImpossibleGoalItem";
import { atom } from "recoil";

export const impossibleGoalsList = atom({
  key: "impossibleGoalsList",
  default: [] as ImpossibleGoalItem[],
});
