import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
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
export const addGoalChanges = async (event: OutboxItem) => {
  const dump = await getDump(event.relId, event.goalId);
  const { goalId } = event;
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(goalId)
      .modify((obj: GoalItem) => {
        obj.collaboration = { ...obj.collaboration, newUpdates: true };
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
  if (!dump) { await createDumpForContact(event); } else {
    db.transaction("rw", db.outboxCollection, async () => {
      await db.outboxCollection.where("goalId").equals(goalId)
        .modify((obj: OutboxItem) => {
          obj.subgoals = [...obj.subgoals, ...event.subgoals];
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  }
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

export const addDeleteChanges = async (event: OutboxItem) => {
  const dump = await getDump(event.relId, event.goalId);
  const { goalId } = event;
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.where("id").equals(goalId)
      .modify((obj: GoalItem) => {
        obj.collaboration = { ...obj.collaboration, newUpdates: true };
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
  if (!dump) { await createDumpForContact(event); } else {
    db.transaction("rw", db.outboxCollection, async () => {
      await db.outboxCollection.where("goalId").equals(goalId)
        .modify((obj: OutboxItem) => {
          obj.deletedGoals = [...obj.deletedGoals, ...event.deletedGoals];
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  }
};
