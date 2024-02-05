import { getAllImpossibleGoals } from "@src/api/ImpossibleGoalsApi";
import { GoalItem } from "@src/models/GoalItem";

/**
 * Sorts goals by prioritizing impossible goals first, followed by remaining goals.
 *
 * @param {GoalItem[]} goals - The list of goals to be sorted.
 * @return {Promise<GoalItem[]>} A promise that resolves with the sorted list of goals.
 */

export const priotizeImpossibleGoals = async (goals: GoalItem[]): Promise<GoalItem[]> => {
  try {
    const allImpossibleGoals = await getAllImpossibleGoals();
    const impossibleGoalIds = allImpossibleGoals.map((impossibleGoal) => impossibleGoal.goalId);
    const prioritizedGoals: GoalItem[] = [];
    const remainingGoals: GoalItem[] = [];
    goals.forEach((goal) => {
      if (impossibleGoalIds.includes(goal.id)) {
        prioritizedGoals.push(goal);
      } else {
        remainingGoals.push(goal);
      }
    });
    const sortedGoals = prioritizedGoals.concat(remainingGoals);
    return sortedGoals;
  } catch (error) {
    console.error("Error in priotizeImpossibleGoals:", error);
    throw error;
  }
};
