import { getAllGoals, updateGoal } from "@src/api/GoalsAPI";
import { ISchedulerOutput } from "@src/Interfaces/IScheduler";

export const updateGoalsImpossibleStatus = async (schedulerOutput: ISchedulerOutput) => {
  const activeGoals = await getAllGoals();

  try {
    const { impossible } = schedulerOutput;
    const impossibleGoalIds = impossible?.map((task) => task.id) || [];

    const updatePromises = activeGoals.map(async (goal) => {
      const isCurrentlyImpossible = impossibleGoalIds.includes(goal.id);
      const currentlyHasImpossibleField = goal.impossible !== undefined;

      if (isCurrentlyImpossible && !currentlyHasImpossibleField) {
        return updateGoal(goal.id, { impossible: true });
      }
      if (!isCurrentlyImpossible && currentlyHasImpossibleField) {
        return updateGoal(goal.id, { impossible: undefined });
      }
      return null;
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating goals impossible status:", error);
    throw error;
  }
};
