import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";

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
  const updatedHintsWithId = goalHints.map((hintItem: IGoalHint) => {
    if (!hintItem.id) {
      return { ...hintItem, id: uuidv4() };
    }
    return hintItem;
  });
  const hintObject = { id: goalId, hint, goalHints: updatedHintsWithId };
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.add(hintObject);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

/**
 * Updates a hint for a specific goal in the database.
 *
 * @param {string} goalId - The ID of the goal to update the hint for.
 * @param {boolean} hint - The new hint value to update.
 * @param {IGoalHint[]} goalHints - The array of goal hints to update.
 * @return {Promise<void>} A promise that resolves when the hint item is updated in the database.
 */
export const updateHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();

      if (existingItem) {
        const updatedHintsWithId = goalHints.map((hintItem: IGoalHint) => {
          if (!hintItem.id) {
            return { ...hintItem, id: uuidv4() };
          }
          return hintItem;
        });

        const filteredHintsWithId = updatedHintsWithId.filter(
          (hintItem) =>
            !existingItem.deletedGoalHints ||
            !existingItem.deletedGoalHints.some((deletedHint) => deletedHint.title === hintItem.title),
        );

        await db.hintsCollection.update(goalId, {
          hint,
          goalHints: filteredHintsWithId,
        });
      } else {
        const newHints = goalHints.map((hintItem) => ({
          ...hintItem,
          id: hintItem.id || uuidv4(),
        }));
        await addHintItem(goalId, hint, newHints);
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

/**
 * Deletes a hint item from the database collection associated with a specific goal ID.
 *
 * @param {string} goalId - The ID of the goal for which the hint item should be deleted.
 */
export const deleteHintItem = async (goalId: string) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.delete(goalId);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

/**
 * Delete a specific goal hint associated with a parent goal.
 *
 * @param {string} parentGoalId - The ID of the parent goal
 * @param {string} goalId - The ID of the goal hint to be deleted
 * @return {Promise<void>} A promise that resolves when the hint is deleted
 */
export const deleteGoalHint = async (parentGoalId: string, goalId: string) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const goalHintsItem = await db.hintsCollection.get(parentGoalId);

      if (goalHintsItem) {
        const updatedGoalHints = goalHintsItem.goalHints.filter((hint) => hint.id !== goalId);
        const deletedGoalHint = goalHintsItem.goalHints.find((hint) => hint.id === goalId);

        const updatedDeletedGoalHints = goalHintsItem.deletedGoalHints ? [...goalHintsItem.deletedGoalHints] : [];

        if (deletedGoalHint) {
          const deletedHintDetails: IGoalHint = { ...deletedGoalHint };
          delete deletedHintDetails.id;
          updatedDeletedGoalHints.push(deletedHintDetails);
        }

        await db.hintsCollection.update(parentGoalId, {
          goalHints: updatedGoalHints,
          deletedGoalHints: updatedDeletedGoalHints,
        });
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
