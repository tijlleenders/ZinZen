/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { TrashItem } from "@src/models/TrashItem";

export const getDeletedGoals = async (parentGoalId: string) => {
  console.log("🚀 ~ getDeletedGoals ~ parentGoalId:", parentGoalId);
  const childrenGoals: TrashItem[] = await db.goalTrashCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .sortBy("deletedAt");
  childrenGoals.reverse();
  console.log("🚀 ~ getDeletedGoals ~ childrenGoals:", childrenGoals);
  return childrenGoals;
};

export const addDeletedGoal = async (goal: GoalItem) => {
  console.log("🚀 ~ addDeletedGoal ~ goal:", goal);
  await db
    .transaction("rw", db.goalTrashCollection, async () => {
      await db.goalTrashCollection.add({ ...goal, deletedAt: new Date().toISOString() });
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
