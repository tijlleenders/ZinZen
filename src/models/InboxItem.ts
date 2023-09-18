import { GoalItem } from "./GoalItem";

export type typeOfChange = "subgoals" | "modifiedGoals" | "archived" | "deleted";

export type changesInId = { level: number; id: string };

export type changesInGoal = { level: number; goal: GoalItem };
export interface IChangesInGoal {
  subgoals: changesInGoal[];
  modifiedGoals: changesInGoal[];
  archived: changesInId[];
  deleted: changesInId[];
}

export interface InboxItem {
  id: string;
  goalChanges: IChangesInGoal;
}
