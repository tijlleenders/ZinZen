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
  let newGoalId;
  await db
    .transaction("rw", db.goalsCollection, async () => {
      newGoalId = await db.goalsCollection.add(goals);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newGoalId;
};

export const removeGoal = async (goalId: number) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.delete(goalId);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getGoal = async (goalId: number) => {
  const goal: GoalItem[] = await db.goalsCollection.where("id").equals(goalId).toArray();
  return goal[0];
};

export const getChildrenGoals = async (parentGoalId: number) => {
  const childrenGoals: GoalItem[] = await db.goalsCollection.where("parentGoalId").equals(parentGoalId).toArray();
  return childrenGoals;
};

export const getAllGoals = async () => {
  const allGoals = await db.goalsCollection.toArray();
  return allGoals;
};

export const getActiveGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(0).toArray();
  // Filter and return only parent goals
  const activeParentGoals = activeGoals.filter((goal: GoalItem) => goal.parentGoalId === -1);
  return activeParentGoals;
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

export const archiveGoal = async (id: number) => {
  const updatedGoalStatus = { status: 1 };
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, updatedGoalStatus);
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
  goalDuration: number,
  goalStart: Date | null,
  goalFinish: Date | null,
  goalStatus: 0 | 1,
  parentGoalId: number | -1
) => {
  const newGoal: GoalItem = {
    title: goalTitle,
    repeat: goalRepeats ? "Daily" : "Once",
    duration: goalDuration,
    start: goalStart,
    finish: goalFinish,
    status: goalStatus,
    parentGoalId,
  };
  return newGoal;
};

export const removeChildrenGoals = async (parentGoalId: number) => {
  const childrenGoals = await getChildrenGoals(parentGoalId);
  childrenGoals.map((goal: GoalItem) => removeGoal(Number(goal.id)));
};
