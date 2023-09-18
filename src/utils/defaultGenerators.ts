import { v5 as uuidv5 } from "uuid";

import { IShared } from "@src/Interfaces/IShared";
import { GoalItem } from "@src/models/GoalItem";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { colorPalleteList, myNameSpace } from ".";

export const createPublicGroupObject = (params: object) => {
  const groupItem: PublicGroupItem = {
    id: "",
    title: "N/A",
    polls: [],
    language: "English",
    groupColor: colorPalleteList[0],
    createdAt: new Date().toISOString(),
    ...params,
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
    subgoals: [],
    modifiedGoals: [],
    archived: [],
    deleted: [],
  };
}

export function getDefaultValueOfCollab() {
  const value: ICollaboration = {
    newUpdates: false,
    collaborators: [],
    allowed: true,
  };
  return value;
}

export function getDefaultValueOfShared() {
  const shared: IShared = {
    conversionRequests: { status: false, senders: [] },
    contacts: [],
    allowed: true,
  };
  return shared;
}
