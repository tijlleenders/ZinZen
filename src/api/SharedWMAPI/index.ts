import { db } from "@models";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { GoalItem } from "@src/models/GoalItem";
import { addGoal } from "../GoalsAPI";

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

export const addSharedWMGoal = async (goalDetails: object) => {
  const newGoal = createGoalObjectFromTags({ ...goalDetails, typeOfGoal: "shared" });
  await db
    .transaction("rw", db.sharedWMCollection, async () => {
      await db.sharedWMCollection.add(newGoal);
    }).then(async () => {
      const { parentGoalId } = newGoal;
      if (parentGoalId !== "root") { await addSharedWMSublist(parentGoalId, [newGoal.id]); }
    }).catch((e) => {
      console.log(e.stack || e);
    });
  return newGoal.id;
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

export const updateSharedWMGoal = async (id: string, changes: object) => {
  db.transaction("rw", db.sharedWMCollection, async () => {
    await db.sharedWMCollection.update(id, changes).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoal = async (goal: GoalItem) => {
  db.transaction("rw", db.sharedWMCollection, async () => {
    await db.sharedWMCollection.update(goal.id, { archived: "true" });
  });
  if (goal.parentGoalId !== "root") {
    const parentGoal = await getSharedWMGoal(goal.parentGoalId);
    db.transaction("rw", db.sharedWMCollection, async () => {
      await db.sharedWMCollection.update(goal.parentGoalId, { sublist: parentGoal.sublist.filter((ele) => ele !== goal.id) });
    });
  }
};

export const archiveChildrenGoals = async (id: string) => {
  const childrenGoals = await getSharedWMChildrenGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await archiveChildrenGoals(goal.id);
      await archiveGoal(goal);
    });
  }
};

export const archiveSharedWMGoal = async (goal: GoalItem) => {
  await archiveChildrenGoals(goal.id);
  await archiveGoal(goal);
};

export const removeGoal = async (goalId: string) => {
  await db.sharedWMCollection.delete(goalId).catch((err) => console.log("failed to delete", err));
};

export const removeChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals = await getSharedWMChildrenGoals(parentGoalId);
  if (childrenGoals.length === 0) { return; }
  childrenGoals.forEach((goal) => {
    removeChildrenGoals(goal.id);
    removeGoal(goal.id);
  });
};

export const transferToMyGoals = async (id: string) => {
  const childrenGoals = await getSharedWMChildrenGoals(id);
  if (childrenGoals.length === 0) { return; }
  childrenGoals.forEach((goal) => {
    transferToMyGoals(goal.id);
    addGoal(goal).then(async () => removeGoal(goal.id));
  });
};
