import { db } from "@models";
import { IChangesInGoal, InboxItem, typeOfChange } from "@src/models/InboxItem";
import { getDefaultValueOfGoalChanges } from "@src/utils";

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
          obj.goalChanges[changeType] = [...obj.goalChanges[changeType], ...newChanges[changeType]];
        });
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const deleteGoalChangesInID = async (id:string, changes: IChangesInGoal) => {
  db.transaction("rw", db.inboxCollection, async () => {
    await db.inboxCollection.where("id").equals(id)
      .modify((obj: InboxItem) => {
        Object.keys(changes).forEach((changeType: typeOfChange) => {
          const arr = [...obj.goalChanges[changeType]];
          obj.goalChanges[changeType] = arr.filter((ele) =>
            (["archived", "deleted"].includes(changeType)
              ? !changes[changeType].includes(ele.id)
              : !changes[changeType].includes(ele.goal.id))
          );
        });
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
