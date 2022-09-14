// @ts-nocheck
import { atom, selector } from "recoil";

export interface ISubGoalHistory {
  goalID: number,
  goalColor: string,
  goalTitle: string,
}

export const displayGoalId = atom({
  key: "displayGoalId",
  default: -1 as number
});
export const displayAddGoal = atom({
  key: "displayAddGoal",
  default: null as {open: boolean, goalId: number} | null
});
export const displayUpdateGoal = atom({
  key: "displayUpdateGoal",
  default: null as {open: boolean, goalId: number} | null
});
export const goalsHistory = atom({
  key: "goalsHistory",
  default: [] as ISubGoalHistory[],
});
