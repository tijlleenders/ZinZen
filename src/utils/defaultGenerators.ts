import { ChangesByType } from "@src/models/InboxItem";

export function getDefaultValueOfGoalChanges(): ChangesByType {
  return {
    subgoals: [],
    modifiedGoals: [],
    archived: [],
    deleted: [],
    restored: [],
    moved: [],
    newGoalMoved: [],
  };
}
