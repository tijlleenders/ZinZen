import { GoalItem } from "@src/models/GoalItem";

export const priotizeImpossibleGoals = async (goals: GoalItem[]): Promise<GoalItem[]> => {
  try {
    // Use the goal's own impossible field as primary source
    const prioritizedGoals: GoalItem[] = [];
    const remainingGoals: GoalItem[] = [];

    goals.forEach((goal) => {
      if (goal.impossible === true) {
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
