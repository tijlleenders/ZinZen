import { db } from "@models";
import { getJustDate } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";

export const resetDatabase = () =>
  db.transaction("rw", db.goalsCollection, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });

export const addGoal = async (goalDetails: GoalItem) => {
  const currentDate = getJustDate(new Date());
  const goals: GoalItem = { ...goalDetails, createdAt: currentDate };
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.add(goals);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeGoal = (goalId: number) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.delete(goalId);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllGoals = async () => {
  const allGoals = await db.goalsCollection.toArray();
  return allGoals;
};

export const getActiveGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(0).toArray();
  return activeGoals;
};

export const getAllArchivedGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(1).toArray();
  return activeGoals;
};

export const getGoalsOnDate = async (date: Date) => {
  db.transaction("rw", db.goalsCollection, async () => {
    const goalsList = await db.goalsCollection.where("start").equals(date);
    return goalsList;
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const updateGoal = async (id: number, changes: object) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, changes).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoal = async (id: number, updatedGoal: object) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, updatedGoal);
  });
};

export const isCollectionEmpty = async () => {
  const goalsCount = await db.goalsCollection.count();
  if (goalsCount === 0) {
    return true;
  }
  const allGoals = await getAllGoals();
  const archivedGoals = await getAllArchivedGoals();
  return allGoals.length === archivedGoals.length;
};

export const createGoal = (
  goalTitle: string,
  goalRepeats: boolean,
  goalDuration: Number,
  goalStart: Date | null,
  goalFinish: Date | null,
  goalStatus: 0 | 1
) => {
  const newGoal: GoalItem = {
    title: goalTitle,
    repeat: goalRepeats ? "Daily" : "Once",
    duration: goalDuration,
    start: goalStart,
    finish: goalFinish,
    status: goalStatus,
  };
  return newGoal;
};
