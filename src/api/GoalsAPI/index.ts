/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { shareGoal } from "@src/services/goal.service";
import { convertIntoAnonymousGoal } from "@src/helpers/GoalProcessor";
import { getDefaultValueOfShared } from "@src/utils";

export const resetDatabase = () =>
  db.transaction("rw", db.goalsCollection, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });

export const addIntoSublist = async (parentGoalId: string, goalIds: string[]) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(parentGoalId)
      .modify((obj: GoalItem) => {
        obj.sublist = [...obj.sublist, ...goalIds];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addGoal = async (goalDetails: GoalItem) => {
  // @ts-ignore
  const goals: GoalItem = { ...goalDetails, createdAt: new Date() };
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

export const getGoal = async (goalId: string) => {
  const goal: GoalItem[] = await db.goalsCollection.where("id").equals(goalId).toArray();
  return goal[0];
};

export const getChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals: GoalItem[] = await db.goalsCollection.where("parentGoalId").equals(parentGoalId).and((goal) => goal.archived === "false").sortBy("createdAt");
  childrenGoals.reverse();
  return childrenGoals;
};

export const getAllGoals = async () => {
  const allGoals = await db.goalsCollection.toArray();
  allGoals.reverse();
  return allGoals;
};

export const getActiveGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("archived").equals("false").sortBy("createdAt");
  // Filter and return only parent goals
  const activeParentGoals = activeGoals.filter((goal: GoalItem) => goal.parentGoalId === "root");
  activeParentGoals.reverse();
  return activeParentGoals;
};

export const getAllArchivedGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("archived").equals("true").sortBy("createdAt");
  activeGoals.reverse();
  return activeGoals;
};

export const getGoalsFromArchive = async (parentId: string) => {
  const parentIds: string[] = [];
  if (parentId === "root") {
    parentIds.push("root");
  } else {
    const parentGoal = await getGoal(parentId);
    const parentGoals = await db.goalsCollection.where("title").equalsIgnoreCase(parentGoal.title.toLowerCase()).toArray();
    parentGoals.forEach((goal) => {
      parentIds.push(goal.id);
    });
  }
  const archivedGoals = await db.goalsCollection.where("archived").equals("true").and((goal) => parentIds.includes(goal.parentGoalId)).sortBy("createdAt");
  archivedGoals.reverse();
  return archivedGoals;
};

export const getGoalsOnDate = async (date: Date) => {
  db.transaction("rw", db.goalsCollection, async () => {
    const goalsList = await db.goalsCollection.where("start").equals(date);
    return goalsList;
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const updateGoal = async (id: string, changes: object) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, changes).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoal = async (goal: GoalItem) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(goal.id, { archived: "true" });
  });
  if (goal.parentGoalId !== "root") {
    const parentGoal = await getGoal(goal.parentGoalId);
    db.transaction("rw", db.goalsCollection, async () => {
      await db.goalsCollection.update(goal.parentGoalId, { sublist: parentGoal.sublist.filter((ele) => ele !== goal.id) });
    });
  }
};

export const archiveChildrenGoals = async (id: string) => {
  const childrenGoals = await getChildrenGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await archiveChildrenGoals(goal.id);
      await archiveGoal(goal);
    });
  }
};

export const archiveUserGoal = async (goal: GoalItem) => {
  await archiveChildrenGoals(goal.id);
  await archiveGoal(goal);
};

export const archiveRootGoalsByTitle = async (goalTitle: string) => {
  const goals: GoalItem[] = await db.goalsCollection.where("parentGoalId").equals("root").and((goal) => goal.title.toLowerCase() === goalTitle.toLowerCase() && goal.archived === "false").toArray();
  goals.forEach(async (ele) => {
    await db.goalsCollection.update(ele.id, { status: 1 });
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

export const removeGoal = async (goalId: string) => {
  await db.goalsCollection.delete(goalId).catch((err) => console.log("failed to delete", err));
};

export const removeChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals = await getChildrenGoals(parentGoalId);
  if (childrenGoals.length === 0) { return; }
  childrenGoals.forEach((goal) => {
    removeChildrenGoals(goal.id);
    removeGoal(goal.id);
  });
};

export const shareMyGoal = async (goal: GoalItem, parent: string) => {
  const shareableGoal = {
    method: "shareGoal",
    parentTitle: parent,
    goal: convertIntoAnonymousGoal(goal)
  };
  const res = await shareGoal(shareableGoal);
  return res;
};

export const updateSharedStatusOfGoal = async (id: string, relId: string, name: string) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(id)
      .modify((obj: GoalItem) => {
        obj.typeOfGoal = "shared";
        obj.shared.contacts = [...obj.shared.contacts, { relId, name }];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const convertSharedGoalToColab = async (id: string, accepted = true) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(id)
      .modify((obj: GoalItem) => {
        if (accepted) {
          obj.collaboration.collaborators.push(obj.shared.contacts[0]);
          obj.typeOfGoal = "collaboration";
          obj.shared = getDefaultValueOfShared();
        } else { obj.shared.conversionRequests = getDefaultValueOfShared().conversionRequests; }
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const notifyNewColabRequest = async (id:string, relId: string) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(id)
      .modify((obj: GoalItem) => {
        obj.shared.conversionRequests = { status: true, senders: [relId] };
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const updateColabStatusOfGoal = async (id: string, collaboration: ICollaboration) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(id)
      .modify((obj: GoalItem) => {
        obj.collaboration = { ...collaboration };
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const notifyItsAncestor = async (goalId: string, allAncestors = true, reduceCount = false) => {
  let parentId = "";
  if (goalId === "root") return;
  console.log("parent update", goalId);
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(goalId)
      .modify((obj: GoalItem) => {
        parentId = obj.parentGoalId;
        const { notificationCounter } = obj.collaboration;
        obj.collaboration = { ...obj.collaboration, notificationCounter: notificationCounter + (reduceCount ? -1 : 1) };
      });
  }).then(async () => {
    if (allAncestors) {
      await notifyItsAncestor(parentId, allAncestors, reduceCount);
    }
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const changeNewUpdatesStatus = async (newUpdates: boolean, goalId: string) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(goalId)
      .modify(async (obj: GoalItem) => {
        obj.collaboration = {
          ...obj.collaboration,
          newUpdates,
          allowed: false,
        };
      });
  }).catch((e) => {
    console.log(e.stack || e, goalId);
  });
};

export const removeGoalWithChildrens = async (goal: GoalItem) => {
  await removeChildrenGoals(goal.id);
  await removeGoal(goal.id);
  if (goal.parentGoalId !== "root") {
    getGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
      const parentGoalSublist = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goal.id);
      if (childGoalIndex !== -1) { parentGoalSublist.splice(childGoalIndex, 1); }
      await updateGoal(parentGoal.id, { sublist: parentGoalSublist });
    });
  }
};
