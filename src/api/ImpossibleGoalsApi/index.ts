import { db } from "@src/models";
import { getGoal } from "../GoalsAPI";

export const addImpossibleGoal = async (impossibleGoalId: string) => {
  try {
    const goal = await getGoal(impossibleGoalId);
    if (!goal) throw new Error("Goal not found.");

    const impossibleGoal = {
      goalId: impossibleGoalId,
      goalTitle: goal.title,
    };

    await db.transaction("rw", db.impossibleGoalsCollection, async () => {
      const exists = await db.impossibleGoalsCollection.where({ goalId: impossibleGoalId }).first();

      if (exists) return;

      await db.impossibleGoalsCollection.add(impossibleGoal);
    });
  } catch (error) {
    console.error("Error adding impossible goal:", error.message);
    throw new Error("Failed to add impossible goal.");
  }
};

export const getImpossibleGoalById = async (impossibleGoalId: string) => {
  try {
    return await db.impossibleGoalsCollection.where({ goalId: impossibleGoalId }).first();
  } catch (error) {
    console.error("Error getting impossible goal:", error.message);
    throw new Error("Failed to get impossible goal.");
  }
};

export const deleteAllImpossibleGoals = async () => {
  try {
    await db.transaction("rw", db.impossibleGoalsCollection, async () => {
      await db.impossibleGoalsCollection.clear();
    });
  } catch (error) {
    console.error("Error deleting impossible goals:", error.message);
    throw new Error("Failed to delete impossible goals.");
  }
};
