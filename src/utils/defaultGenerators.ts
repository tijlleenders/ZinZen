import { v5 as uuidv5 } from "uuid";

import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { GoalItem } from "@src/models/GoalItem";
import { colorPalleteList, myNameSpace } from ".";

export const createPublicGroupObject = (params: object) => {
  const groupItem: PublicGroupItem = {
    id: "",
    title: "N/A",
    polls: [],
    language: "English",
    groupColor: colorPalleteList[0],
    createdAt: new Date().toISOString(),
    ...params
  };
  groupItem.id = uuidv5(groupItem.title, myNameSpace);
  return groupItem;
};

export const createPollObject = (goal: GoalItem, params: object = {}) => ({
  id: uuidv5(goal.title, myNameSpace),
  goal,
  metrics: {
    upVotes: 0,
    downVotes: 0,
    inMyGoals: 0,
    completed: 0
  },
  myMetrics: {
    voteScore: 0,
    inMyGoals: false,
    completed: false,
  },
  createdAt: new Date().toISOString(),
  ...params
});
