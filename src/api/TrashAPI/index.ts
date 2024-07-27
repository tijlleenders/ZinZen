import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { TrashItem } from "@src/models/TrashItem";
import { addDeletedGoal, addGoal } from "../GoalsAPI";
import { addSharedWMGoal } from "../SharedWMAPI";

const TRASH_RETENTION_DAYS = 7;

export const getDeletedGoals = async (parentGoalId: string) => {
  const childrenGoals: TrashItem[] = await db.goalTrashCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .sortBy("deletedAt");
  childrenGoals.reverse();
  return childrenGoals;
};

export const getDeletedGoal = async (goalId: string) => {
  const delGoal: TrashItem[] = await db.goalTrashCollection.where("id").equals(goalId).toArray();
  return delGoal.length > 0 ? delGoal[0] : null;
};

export const getDeletedGoalById = (id: string) => {
  return db.goalTrashCollection.get(id);
};

export const restoreGoal = async (goal: GoalItem, isShareWMType = false) => {
  db.goalTrashCollection.delete(goal.id).catch((err) => console.log("failed to delete", err));
  if (isShareWMType) {
    await addSharedWMGoal(goal);
  } else {
    await addGoal(goal);
  }
};

export const restoreChildrenGoals = async (id: string, isShareWMType = false) => {
  const childrenGoals: TrashItem[] = await getDeletedGoals(id);
  if (childrenGoals) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    childrenGoals.forEach(async ({ deletedAt, ...goal }) => {
      await restoreChildrenGoals(goal.id, isShareWMType);
      await restoreGoal(goal, isShareWMType);
    });
  }
};

export const restoreUserGoal = async (goal: GoalItem, isShareWMType = false) => {
  await restoreChildrenGoals(goal.id, isShareWMType);
  await restoreGoal(goal, isShareWMType);
};

export const removeDeletedGoal = async (goal: GoalItem) => {
  await Promise.allSettled([
    db.goalsCollection.delete(goal.id).catch((err) => console.log("failed to delete", err)),
    addDeletedGoal(goal),
  ]);
};

export const removeDeletedChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals = await getDeletedGoals(parentGoalId);
  if (childrenGoals.length === 0) {
    return;
  }
  childrenGoals.forEach((goal) => {
    removeDeletedChildrenGoals(goal.id);
    removeDeletedGoal(goal);
  });
};

export const removeDeletedGoalWithChildrens = async (goal: GoalItem) => {
  await removeDeletedChildrenGoals(goal.id);
  await removeDeletedGoal(goal);
  if (goal.parentGoalId !== "root") {
    getDeletedGoal(goal.parentGoalId).then(async (deletedGoal) => {
      if (!deletedGoal) {
        return;
      }
      const parentGoalSublist = deletedGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goal.id);
      if (childGoalIndex !== -1) {
        parentGoalSublist.splice(childGoalIndex, 1);
      }
      await db.goalTrashCollection.update(deletedGoal.id, { sublist: parentGoalSublist }).then((updated) => updated);
    });
  }
};

export const getParticipantsOfDeletedGoal = async (id: string) => {
  const goals = await db.goalTrashCollection
    .where("id")
    .anyOf(...[id])
    .toArray();
  return goals.flatMap((goal) => goal.participants.map((participant) => ({ sub: participant, rootGoalId: goal.id })));
};

export const cleanupTrash = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - TRASH_RETENTION_DAYS);
  const oldTrashItems = await db.goalTrashCollection.where("deletedAt").below(sevenDaysAgo.toISOString()).toArray();
  await Promise.all(oldTrashItems.map((item) => db.goalTrashCollection.delete(item.id)));
};

function isMoreThan24HoursAgo(isoTimestamp: string): boolean {
  const timestamp = new Date(isoTimestamp).getTime();
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return now - timestamp > twentyFourHours;
}

export const checkAndCleanupTrash = async () => {
  const lastCleanupTimestamp = localStorage.getItem("lastTrashCleanup");
  const currentTime = new Date().toISOString();
  if (!lastCleanupTimestamp || isMoreThan24HoursAgo(lastCleanupTimestamp)) {
    await cleanupTrash();
    localStorage.setItem("lastTrashCleanup", currentTime);
  }
};
