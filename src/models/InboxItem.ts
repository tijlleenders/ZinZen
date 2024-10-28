import { GoalItem } from "./GoalItem";

export type typeOfChange = "subgoals" | "modifiedGoals" | "archived" | "deleted" | "restored" | "moved";

export type typeOfIntent = "suggestion" | "shared";
export type changesInId = { level: number; id: string; intent: typeOfIntent };
export type changesInGoal = { level: number; goal: GoalItem; intent: typeOfIntent };

export interface IChangesInGoal {
  subgoals: changesInGoal[];
  modifiedGoals: changesInGoal[];
  archived: changesInId[];
  deleted: changesInId[];
  restored: changesInId[];
  moved: changesInId[];
  // newGoalMoved: changesInGoal[];
}

export interface InboxItem {
  id: string;
  changes: {
    [relId: string]: IChangesInGoal;
  };
}
