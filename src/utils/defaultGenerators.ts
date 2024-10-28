import { v5 as uuidv5 } from "uuid";

import { GoalItem } from "@src/models/GoalItem";
import { changesInGoal, changesInId } from "@src/models/InboxItem";
import { myNameSpace } from ".";

export const createPollObject = (goal: GoalItem, params: object = {}) => ({
  id: uuidv5(goal.title, myNameSpace),
  goal,
  metrics: {
    upVotes: 0,
    downVotes: 0,
    inMyGoals: 0,
    completed: 0,
  },
  myMetrics: {
    voteScore: 0,
    inMyGoals: false,
    completed: false,
  },
  createdAt: new Date().toISOString(),
  ...params,
});

export function getDefaultValueOfGoalChanges() {
  return {
    subgoals: [] as changesInGoal[],
    modifiedGoals: [] as changesInGoal[],
    archived: [] as changesInId[],
    deleted: [] as changesInId[],
    restored: [] as changesInId[],
    moved: [] as changesInId[],
  };
}
