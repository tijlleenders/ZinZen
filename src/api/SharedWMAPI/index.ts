import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";

export const addSharedWMSublist = async (parentGoalId: string, goalIds: string[]) => {
  db.transaction("rw", db.sharedWMCollection, async () => {
    await db.sharedWMCollection.where("id").equals(parentGoalId)
      .modify((obj: GoalItem) => {
        obj.sublist = [...obj.sublist, ...goalIds];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addSharedWMGoal = async (goalDetails: GoalItem) => {
  let newGoalId;
  await db
    .transaction("rw", db.sharedWMCollection, async () => {
      newGoalId = await db.sharedWMCollection.add(goalDetails);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newGoalId;
};

export const addGoalsInSharedWM = async (goals: GoalItem[]) => {
  goals.forEach((ele) => {
    addSharedWMGoal(ele).then((res) => console.log(res, "added"));
  });
};

export const getSharedWMGoal = async (goalId: string) => {
  const goal: GoalItem[] = await db.sharedWMCollection.where("id").equals(goalId).toArray();
  return goal[0];
};

export const getSharedWMChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals: GoalItem[] = await db.sharedWMCollection.where("parentGoalId").equals(parentGoalId).and((goal) => goal.archived === "false").toArray();
  childrenGoals.reverse();
  return childrenGoals;
};

export const getAllSharedWMGoals = async () => {
  const allGoals = await db.sharedWMCollection.toArray();
  allGoals.reverse();
  return allGoals;
};

export const getActiveSharedWMGoals = async () => {
  const activeGoals: GoalItem[] = await db.sharedWMCollection.where("parentGoalId").equals("root").toArray();
  // Filter and return only parent goals
  const activeParentGoals = activeGoals.filter((goal: GoalItem) => goal.archived === "false");
  activeParentGoals.reverse();
  return activeParentGoals;
};
