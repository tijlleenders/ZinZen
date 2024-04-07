import { db } from "@src/models";
import { GoalItem } from "@src/models/GoalItem";
import { IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";
import { addGoal } from "../GoalsAPI";

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
 */
export const updateHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  const updatedHintsWithId = goalHints.map((hintItem: IGoalHint) => {
    if (!hintItem.id) {
      const newHintItem = { ...hintItem, id: uuidv4() };
      return newHintItem;
    }
    return hintItem;
  });
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();
      if (existingItem) {
        await db.hintsCollection.update(goalId, { hint, updateHintItem: updatedHintsWithId });
      } else {
        await addHintItem(goalId, hint, updatedHintsWithId);
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

/**
 * Deletes a hint item associated with a specific goal ID.
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
const deleteGoalHint = async (parentGoalId: string, goalId: string) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const goalHints = await db.hintsCollection.get(parentGoalId);

      const goalHint = goalHints?.goalHints.filter((hint) => hint.id !== goalId);
      console.log(goalHint, "goalHint");

      await db.hintsCollection.update(parentGoalId, { goalHints: goalHint });
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

/**
 * Add a hint goal to the list of goals.
 *
 * @param {GoalItem} goal - The goal item to add as a hint goal.
 * @return {Promise<void>} A promise that resolves when the hint goal is added successfully.
 */
export const addHintGoaltoMyGoals = async (goal: GoalItem) => {
  await addGoal(goal);
  await deleteGoalHint(goal.parentGoalId, goal.id);
};
