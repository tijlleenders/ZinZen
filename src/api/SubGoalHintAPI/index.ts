import { db } from "@src/models";
import { SubGoalHint } from "@src/models/SubGoalHint";

export const addSubGoalHint = async (newSubGoalHint: SubGoalHint[]) => {
  await db
    .transaction("rw", db.subGoalHintCollection, async () => {
      await db.subGoalHintCollection.bulkAdd(newSubGoalHint);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const getSubGoalHints = async (goalId: string) => {
  const hintRecord = await db.hintRecordCollection.where("goalItemId").equals(goalId).first();
  if (!hintRecord) {
    return [];
  }
  const hints = await db.subGoalHintCollection.where("hintRecordId").equals(hintRecord.id).toArray();
  return hints;
};

export const deleteSubGoalHint = async (id: string) => {
  await db
    .transaction("rw", db.subGoalHintCollection, async () => {
      await db.subGoalHintCollection.delete(id);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
