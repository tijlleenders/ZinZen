import { GoalItem } from "./GoalItem";

export type IdChangeTypes = "deleted" | "moved" | "restored" | "archived";
type GoalChangeTypes = "subgoals" | "modifiedGoals" | "newGoalMoved";

export type typeOfChange = IdChangeTypes | GoalChangeTypes;

export type typeOfIntent = "suggestion" | "shared";
export type changesInId = { level: number; id: string; intent: typeOfIntent };
export type changesInGoal = { level: number; goal: GoalItem; intent: typeOfIntent };

export type ChangesByType = {
  [K in IdChangeTypes]: changesInId[];
} & {
  [K in GoalChangeTypes]: changesInGoal[];
};

export interface InboxItem {
  id: string;
  changes: {
    [relId: string]: ChangesByType;
  };
}
