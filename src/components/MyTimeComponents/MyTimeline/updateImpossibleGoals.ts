import { getGoal } from "@src/api/GoalsAPI";
import { deleteAllImpossibleGoals, addImpossibleGoal } from "@src/api/ImpossibleGoalsApi";

interface FormattedGoal {
  goalId: string;
  goalTitle: string;
}

const fetchAndFormatGoal = async (taskId: string): Promise<FormattedGoal | null> => {
  const goal = await getGoal(taskId);
  return goal
    ? {
        goalId: goal.id,
        goalTitle: goal.title,
      }
    : null;
};

export const updateImpossibleGoals = async (impossibleTasks: string[]) => {
  try {
    const newImpossibleGoals = await Promise.all(impossibleTasks.map(fetchAndFormatGoal));

    await deleteAllImpossibleGoals();

    const validImpossibleGoals = newImpossibleGoals.filter((goal): goal is FormattedGoal => goal !== null);

    await Promise.all(validImpossibleGoals.map((goal) => addImpossibleGoal(goal.goalId)));
  } catch (error) {
    console.error("Error in updateImpossibleGoals:", error);
  }
};
