/* eslint-disable no-param-reassign */
import { db } from "@models";
import { IChangesInGoal, InboxItem, typeOfChange } from "@src/models/InboxItem";
import { getDefaultValueOfGoalChanges } from "@src/utils/defaultGenerators";

export const createEmptyInboxItem = async (id: string) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection.add({ id, goalChanges: getDefaultValueOfGoalChanges() });
  }).catch((e) => {
    console.log(e);
  });
};

export const getInboxItem = async (id: string) => {
  const inboxItems: InboxItem[] = await db.inboxCollection.where("id").equals(id).toArray();
  return inboxItems[0];
};

export const addGoalChangesInID = async (id: string, newChanges: IChangesInGoal) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection.where("id").equals(id)
      .modify((obj: InboxItem) => {
        Object.keys(newChanges).forEach((changeType: typeOfChange) => {
          // @ts-ignore
          obj.goalChanges[changeType] = [...obj.goalChanges[changeType], ...newChanges[changeType]];
        });
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const deleteGoalChangesInID = async (id:string, categoryOfChange:typeOfChange, changes: string[]) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection.where("id").equals(id)
      .modify((obj: InboxItem) => {
        const arr = [...obj.goalChanges[categoryOfChange]];
        // @ts-ignore
        obj.goalChanges[categoryOfChange] = arr.filter((ele) =>
          !changes.includes("goal" in ele ? ele.goal.id : ele.id)
        );
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
