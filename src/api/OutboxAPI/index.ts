import { db } from "@models";
import { OutboxItem } from "@src/models/OutboxItem";
import { changeNewUpdatesStatus, removeGoal } from "../GoalsAPI";

export const getDump = async (relId = "", goalId = "") => {
  const dump: OutboxItem[] = await db.outboxCollection.where("goalId").equals(goalId).and((obj) => obj.relId === relId).toArray();
  return dump[0];
};
export const createDumpForContact = async (dump: OutboxItem) => {
  await db
    .transaction("rw", db.outboxCollection, async () => {
      await db.outboxCollection.add(dump);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
export const cleanChangesOf = async (goalId: string, k: string) => {
  await db.transaction("rw", db.outboxCollection, async () => {
    await db.outboxCollection.where("goalId").equals(goalId)
      .modify((obj: OutboxItem) => {
        obj[k] = [];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
export const deleteChanges = async (root: boolean, goalId: string) => {
  await removeGoal(goalId);
  if (root) {
    await db.outboxCollection.where("goalId").equals(goalId).delete();
  }
};
export const completeChanges = async (root: boolean, goalId: string) => {
  if (root) {
    await db.outboxCollection.where("goalId").equals(goalId).delete();
  }
};

export const addChangesInGoal = async (event: OutboxItem, type: "subgoals" | "updatedGoals" | "deletedGoals"| "completedGoals") => {
  const dump = await getDump(event.relId, event.goalId);
  const { goalId } = event;
  changeNewUpdatesStatus(true, goalId);
  if (!dump) { await createDumpForContact(event); } else {
    db.transaction("rw", db.outboxCollection, async () => {
      await db.outboxCollection.where("goalId").equals(goalId)
        .modify((obj: OutboxItem) => {
          obj[type] = [...obj[type], ...event[type]];
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  }
};
