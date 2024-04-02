import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";

export const getGoalHint = async (goalId: string) => {
  const hintItem = await db.hintsCollection.where("id").equals(goalId).toArray();
  return hintItem.length > 0 ? hintItem[0] : null;
};

export const saveHint = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  const hintObject = { id: goalId, hint, goalHints };
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.add(hintObject);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const updateHint = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();
      if (existingItem) {
        await db.hintsCollection.update(goalId, { hint, goalHints });
      } else {
        await saveHint(goalId, hint, []);
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const deleteHint = async (goalId: string) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.delete(goalId);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
