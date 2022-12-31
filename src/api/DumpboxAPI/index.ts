import { db } from "@models";
import { DumpboxItem } from "@src/models/DumpboxItem";

export const getGoal = async (relId: string) => {
  const dump: DumpboxItem[] = await db.dumpboxCollection.where("relId").equals(relId).toArray();
  return dump[0];
};
export const createDumpForContact = async (dump: DumpboxItem) => {
  await db
    .transaction("rw", db.dumpboxCollection, async () => {
      await db.dumpboxCollection.add(dump);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
export const addGoalChanges = async (type: string, event: DumpboxItem) => {
  const dump = await getGoal(event.relId);
  if (!dump) { await createDumpForContact(event); } else {
    const { goalId } = event;
    db.transaction("rw", db.dumpboxCollection, async () => {
      await db.dumpboxCollection.where("goalId").equals(goalId)
        .modify((obj: DumpboxItem) => {
          obj.subgoals = [...obj.subgoals, ...event.subgoals];
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  }
};
