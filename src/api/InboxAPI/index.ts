/* eslint-disable no-param-reassign */
import { db } from "@models";
import { IChangesInGoal, InboxItem, typeOfChange } from "@src/models/InboxItem";
import { getDefaultValueOfGoalChanges } from "@src/utils/defaultGenerators";

export const createEmptyInboxItem = async (id: string) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection.add({ id, changes: {} });
  }).catch((e) => {
    console.log(e);
  });
};

export const getAllInboxItems = async () => {
  const inboxItems: InboxItem[] = await db.inboxCollection.toArray();
  return inboxItems;
};

export const getInboxItem = async (id: string) => {
  const inboxItems: InboxItem[] = await db.inboxCollection.where("id").equals(id).toArray();
  return inboxItems[0];
};

export const removeGoalInbox = async (id: string) => {
  await db.inboxCollection
    .where("id")
    .equals(id)
    .delete()
    .catch((err) => console.log("failed to delete", err));
};

export const addGoalChangesInID = async (id: string, relId: string, newChanges: IChangesInGoal) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection
      .where("id")
      .equals(id)
      .modify((obj: InboxItem) => {
        const currentState = { ...getDefaultValueOfGoalChanges(), ...obj.changes[relId] };
        Object.keys(currentState).forEach((changeType: typeOfChange) => {
          currentState[changeType] = [...currentState[changeType], ...newChanges[changeType]];
        });
        obj.changes[relId] = { ...currentState };
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const deleteGoalChangesInID = async (
  id: string,
  relId: string,
  categoryOfChange: typeOfChange,
  changes: string[],
) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection
      .where("id")
      .equals(id)
      .modify((obj: InboxItem) => {
        const goalChanges = obj.changes[relId][categoryOfChange].filter(
          (ele) => !changes.includes("goal" in ele ? ele.goal.id : ele.id),
        );
        obj.changes[relId][categoryOfChange] = [...goalChanges];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removePPTFromInboxOfGoal = async (id: string, relId: string) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection
      .where("id")
      .equals(id)
      .modify((obj: InboxItem) => {
        delete obj.changes[relId];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
