/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { addGoal, addIntoSublist, getGoalById, updateGoal } from "../GoalsAPI";
import { getContactByRelId } from "../ContactsAPI";
import { getSharedGoalMetadataByGoalId } from "../SharedGoalNotMoved";

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

export const removeSharedWMGoalFromParentSublist = async (goalId: string, parentGoalId: string) => {
  db.transaction("rw", db.sharedWMCollection, async () => {
    await db.sharedWMCollection
      .where("id")
      .equals(parentGoalId)
      .modify((obj: GoalItem) => {
        obj.sublist = obj.sublist.filter((id) => id !== goalId);
      });
  });
};

export const addSharedWMGoal = async (goalDetails: GoalItem, relId = "") => {
  const { participants } = goalDetails;
  let updatedParticipants = participants || [];

  if (relId) {
    const contact = await getContactByRelId(relId);
    if (contact) {
      const contactExists = updatedParticipants.some((p) => p.relId === relId);
      if (!contactExists) {
        updatedParticipants = [...updatedParticipants, { ...contact, following: true, type: "sharer" }];
      }
    }
  }

  const newGoal = createGoalObjectFromTags({
    ...goalDetails,
    typeOfGoal: "shared",
    participants: updatedParticipants,
  });

  await db
    .transaction("rw", db.sharedWMCollection, async () => {
      await db.sharedWMCollection.add(newGoal);
    })
    .then(async () => {
      const { parentGoalId } = newGoal;
      if (parentGoalId !== "root") {
        await addSharedWMSublist(parentGoalId, [newGoal.id]);
      }
    });

  return newGoal.id;
};

export const addGoalsInSharedWM = async (goals: GoalItem[], relId: string) => {
  goals.forEach((ele) => {
    addSharedWMGoal(ele, relId).then((res) => console.log(res, "added"));
  });
};

export const getSharedWMGoal = async (goalId: string) => {
  return db.sharedWMCollection.get(goalId);
};

export const getSharedWMGoalById = (id: string) => {
  return db.sharedWMCollection.get(id);
};

export const getAllSharedWMGoalByPartner = async (relId: string) => {
  const goals = await db.sharedWMCollection.toArray();
  return goals.filter((goal: GoalItem) => goal.participants.some((participant) => participant.relId === relId));
};

export const getSharedWMChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals: GoalItem[] = await db.sharedWMCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .sortBy("createdAt");
  childrenGoals.reverse();
  return childrenGoals;
};

export const getActiveSharedWMGoals = async (parentGoalId: string, relId?: string) => {
  const activeGoals: GoalItem[] = await db.sharedWMCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .and((x) => (relId ? x.participants.length > 0 && x.participants[0].relId === relId : true))
    .and((x) => x.archived !== "true")
    .sortBy("createdAt");
  activeGoals.reverse();
  return activeGoals;
};

export const getArchivedSharedWMGoals = async (parentGoalId: string, relId?: string) => {
  const archivedGoals: GoalItem[] = await db.sharedWMCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .and((x) => (relId ? x.participants.length > 0 && x.participants[0].relId === relId : true))
    .and((x) => x.archived === "true")
    .sortBy("createdAt");
  archivedGoals.reverse();
  return archivedGoals;
};

export const updateSharedWMGoal = async (id: string, changes: Partial<GoalItem>) => {
  db.transaction("rw", db.sharedWMCollection, async () => {
    await db.sharedWMCollection.update(id, { ...changes, typeOfGoal: "shared" }).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoalSharedWMRepository = async (goal: GoalItem) => {
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
      await archiveGoalSharedWMRepository(goal);
    });
  }
};

export const archiveSharedWMGoal = async (goal: GoalItem) => {
  await archiveChildrenGoals(goal.id);
  await archiveGoalSharedWMRepository(goal);
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

export const removeSharedWMGoalWithChildrens = async (goal: GoalItem) => {
  await removeSharedWMChildrenGoals(goal.id);
  await removeSharedWMGoal(goal);
};

export const transferChildrenGoalsToMyGoals = async (id: string) => {
  const childrenGoals = await getSharedWMChildrenGoals(id);

  if (childrenGoals.length === 0) {
    return;
  }

  childrenGoals.forEach(async (goal) => {
    transferChildrenGoalsToMyGoals(goal.id);
    try {
      const goalAlreadyExists = await getGoalById(goal.id);

      if (goalAlreadyExists) {
        try {
          await updateGoal(goal.id, {
            ...goal,
            parentGoalId: goal.parentGoalId,
          });
        } catch (error) {
          await addGoal({ ...goal, typeOfGoal: "shared" });
        }
      } else {
        await addGoal({ ...goal, typeOfGoal: "shared" });
      }

      await removeSharedWMGoal(goal);
    } catch (err) {
      console.error(`[transferToMyGoals] Error processing goal ${goal.id}:`, err);
    }
  });
};

export const convertSharedWMGoalToColab = async (goal: GoalItem) => {
  const getSharedGoalMetadata = await getSharedGoalMetadataByGoalId(goal.id);
  if (!getSharedGoalMetadata) {
    return null;
  }

  const { sharedAncestorId } = getSharedGoalMetadata;
  const sharedAncestorGoal = await getGoalById(sharedAncestorId);

  await transferChildrenGoalsToMyGoals(goal.id);

  await addGoal({ ...goal, typeOfGoal: "shared", parentGoalId: sharedAncestorGoal ? sharedAncestorId : "root" });

  await removeSharedWMGoal(goal);

  if (sharedAncestorId !== "root" && sharedAncestorGoal) {
    await addIntoSublist(sharedAncestorId, [goal.id]);
  }

  return {
    convertedGoal: goal,
    parentGoalName: sharedAncestorGoal?.title || "root",
  };
};

export const updateSharedWMParentSublist = async (oldParentId: string, newParentId: string, goalId: string) => {
  // Remove from old parent
  const oldParentGoal = await getSharedWMGoal(oldParentId);
  if (oldParentGoal?.sublist) {
    const updatedOldSublist = oldParentGoal.sublist.filter((id) => id !== goalId);
    await updateSharedWMGoal(oldParentId, { sublist: updatedOldSublist });
  }

  // Add to new parent
  const newParentGoal = await getSharedWMGoal(newParentId);
  if (newParentGoal) {
    const updatedNewSublist = [...(newParentGoal.sublist || []), goalId];
    await updateSharedWMGoal(newParentId, { sublist: updatedNewSublist });
  }
};
