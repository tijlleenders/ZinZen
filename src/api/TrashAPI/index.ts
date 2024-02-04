/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { TrashItem } from "@src/models/TrashItem";
import { addGoal } from "../GoalsAPI";

export const getDeletedGoals = async (parentGoalId: string) => {
  const childrenGoals: TrashItem[] = await db.goalTrashCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .sortBy("deletedAt");
  childrenGoals.reverse();
  return childrenGoals;
};

export const addDeletedGoal = async (goal: GoalItem) => {
  await db
    .transaction("rw", db.goalTrashCollection, async () => {
      await db.goalTrashCollection.add({ ...goal, deletedAt: new Date().toISOString() });
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const getDeletedGoal = async (goalId: string) => {
  const delGoal: TrashItem[] = await db.goalTrashCollection.where("id").equals(goalId).toArray();
  return delGoal.length > 0 ? delGoal[0] : null;
};

export const restoreGoal = async (goal: GoalItem) => {
  db.goalTrashCollection.delete(goal.id).catch((err) => console.log("failed to delete", err));
  if (goal.parentGoalId !== "root" && goal.typeOfGoal !== "shared") {
    await addGoal(goal);
  }
};

export const restoreChildrenGoals = async (id: string) => {
  const childrenGoals: TrashItem[] = await getDeletedGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async ({ deletedAt, ...goal }) => {
      await restoreChildrenGoals(goal.id);
      await restoreGoal(goal);
    });
  }
};

export const restoreUserGoal = async (goal: GoalItem) => {
  await restoreChildrenGoals(goal.id);
  await restoreGoal(goal);
};
