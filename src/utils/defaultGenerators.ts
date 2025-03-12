import { ChangesByType, changesInGoal, changesInId } from "@src/models/InboxItem";

export function getDefaultValueOfGoalChanges(): ChangesByType {
  return {
    subgoals: [] as changesInGoal[],
    modifiedGoals: [] as changesInGoal[],
    archived: [] as changesInId[],
    deleted: [] as changesInId[],
    restored: [] as changesInId[],
    moved: [] as changesInId[],
    newGoalMoved: [] as changesInGoal[],
  };
}
