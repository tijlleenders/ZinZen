/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { addGoal } from "../GoalsAPI";

export const addSharedWMSublist = async (parentGoalId: string, goalIds: string[]) => {
  db.transaction("rw", db.sharedWMCollection, async () => {
    await db.sharedWMCollection
      .where("id")
      .equals(parentGoalId)
      .modify((obj: GoalItem) => {
        obj.sublist = [...obj.sublist, ...goalIds];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addSharedWMGoal = async (goalDetails: GoalItem) => {
  const { participants } = goalDetails;
  const newGoal = createGoalObjectFromTags({ ...goalDetails, typeOfGoal: "shared" });
  if (participants) newGoal.participants = participants;
  await db
    .transaction("rw", db.sharedWMCollection, async () => {
      await db.sharedWMCollection.add(newGoal);
    })
    .then(async () => {
      const { parentGoalId } = newGoal;
      if (parentGoalId !== "root") {
        await addSharedWMSublist(parentGoalId, [newGoal.id]);
      }
    })
    .catch((e) => {
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
  const goal: GoalItem[] = await db.sharedWMCollection.where("id").equals(goalId).sortBy("createdAt");
  return goal[0];
};

export const getSharedWMGoalById = (id: string) => {
  return db.sharedWMCollection.get(id);
};

export const getSharedWMChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals: GoalItem[] = await db.sharedWMCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .sortBy("createdAt");
  childrenGoals.reverse();
  return childrenGoals;
};

export const getAllSharedWMGoals = async () => {
  const allGoals = await db.sharedWMCollection.toArray();
  allGoals.reverse();
  return allGoals;
};

export const getActiveSharedWMGoals = async () => {
  const activeGoals: GoalItem[] = await db.sharedWMCollection.where("parentGoalId").equals("root").sortBy("createdAt");
  activeGoals.reverse();
  return activeGoals;
};

export const getRootGoalsOfPartner = async (relId: string) => {
  return (
    await db.sharedWMCollection
      .where("parentGoalId")
      .equals("root")
      .and((x) => x.participants.length > 0 && x.participants[0].relId === relId)
      .sortBy("createdAt")
  ).reverse();
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
  if (goal.parentGoalId !== "root" && goal.typeOfGoal !== "shared") {
    const parentGoal = await getSharedWMGoal(goal.parentGoalId);
    db.transaction("rw", db.sharedWMCollection, async () => {
      await db.sharedWMCollection.update(goal.parentGoalId, {
        sublist: parentGoal.sublist.filter((ele) => ele !== goal.id),
      });
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

export const removeSharedWMGoal = async (goal: GoalItem) => {
  return db.sharedWMCollection.delete(goal.id).catch((err) => console.log("failed to delete", err));
};

export const removeSharedWMChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals = await getSharedWMChildrenGoals(parentGoalId);
  if (childrenGoals.length === 0) {
    return;
  }
  childrenGoals.forEach((goal) => {
    removeSharedWMChildrenGoals(goal.id);
    removeSharedWMGoal(goal);
  });
};

export const transferToMyGoals = async (id: string) => {
  const childrenGoals = await getSharedWMChildrenGoals(id);
  if (childrenGoals.length === 0) {
    return;
  }
  childrenGoals.forEach((goal) => {
    transferToMyGoals(goal.id);
    addGoal(goal).then(async () => removeSharedWMGoal(goal));
  });
};

export const convertSharedWMGoalToColab = async (goal: GoalItem) => {
  await transferToMyGoals(goal.id)
    .then(async () => {
      addGoal({ ...goal, typeOfGoal: "shared" })
        .then(async () => {
          removeSharedWMGoal(goal);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
