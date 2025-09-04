import { GoalItem } from "@src/models/GoalItem";

export const priotizeImpossibleGoals = async (goals: GoalItem[]): Promise<GoalItem[]> => {
  try {
    const sortedGoals = [...goals].sort((a, b) => {
      if (a.impossible === true && b.impossible !== true) return -1;
      if (a.impossible !== true && b.impossible === true) return 1;
      return 0;
    });

    return sortedGoals;
  } catch (error) {
    console.error("Error in priotizeImpossibleGoals:", error);
    throw error;
  }
};
