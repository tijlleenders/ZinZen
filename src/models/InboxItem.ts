import { GoalItem } from "./GoalItem";

export type IdChangeTypes = "deleted" | "moved" | "restored" | "archived";
type GoalChangeTypes = "subgoals" | "modifiedGoals";

export type typeOfChange = IdChangeTypes | GoalChangeTypes;

export type typeOfIntent = "suggestion" | "shared";
export type changesInId = { level: number; id: string; intent: typeOfIntent; timestamp: number };
export type changesInGoal = { level: number; goal: GoalItem; intent: typeOfIntent };

export type ChangesByType = {
  [K in IdChangeTypes]: changesInId[];
} & {
  [K in GoalChangeTypes]: changesInGoal[];
};

export interface IChangesInGoal {
  subgoals: changesInGoal[];
  modifiedGoals: changesInGoal[];
  archived: changesInId[];
  deleted: changesInId[];
  restored: changesInId[];
}

export interface InboxItem {
  id: string;
  changes: {
    [relId: string]: ChangesByType;
  };
}

export type PayloadType = "sharer" | "suggestion";
export interface Payload {
  relId: string;
  lastProcessedTimestamp: string;
  changeType: typeOfChange;
  notificationGoalId: string;
  changes: (changesInGoal | changesInId)[];
  type: PayloadType;
  timestamp: number;
  TTL: number;
}
