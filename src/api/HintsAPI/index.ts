import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";

/**
 * Retrieves a hint item related to a specific goal ID from the hintsCollection.
 *
 * @param {string} goalId - The ID of the goal to retrieve the hint item for.
 * @return {object | null} The hint item associated with the provided goal ID, or null if not found.
 */
export const getGoalHintItem = async (goalId: string) => {
  const hintItem = await db.hintsCollection.where("id").equals(goalId).toArray();
  return hintItem.length > 0 ? hintItem[0] : null;
};

/**
 * Adds a hint item to the database for a specific goal.
 *
 * @param {string} goalId - The ID of the goal
 * @param {boolean} hint - The hint value
 * @param {IGoalHint[]} goalHints - The array of goal hints from api call
 * @return {Promise<void>} A promise that resolves when the hint item is added to the database
 */
export const addHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
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
        await addHintItem(goalId, hint, []);
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
