import { IGoalCompletedStats } from "@src/Interfaces/IScheduler";
import {
  getTasksCompletedSinceMondayForGoal,
  getTasksSkippedSinceMondayForGoal,
  getTotalDurationCompletedForGoal,
} from "@src/api/TaskHistoryAPI";

const getGoalCompletedStats = async (goalId: string): Promise<IGoalCompletedStats> => {
  const [totalDurationCompleted, tasksCompletedSinceMonday, tasksSkippedSinceMonday] = await Promise.all([
    getTotalDurationCompletedForGoal(goalId),
    getTasksCompletedSinceMondayForGoal(goalId),
    getTasksSkippedSinceMondayForGoal(goalId),
  ]);

  return {
    totalDurationCompleted: totalDurationCompleted ?? undefined,
    tasksCompletedSinceMonday: tasksCompletedSinceMonday ?? undefined,
    tasksSkippedSinceMonday: tasksSkippedSinceMonday ?? undefined,
  };
};

const filterGoalStats = (stats: IGoalCompletedStats): IGoalCompletedStats | null => {
  if (!stats.totalDurationCompleted && !stats.tasksSkippedSinceMonday) return null;

  const statsToInclude: Partial<IGoalCompletedStats> = {
    totalDurationCompleted: stats.totalDurationCompleted || 0,
    tasksCompletedSinceMonday: stats.tasksCompletedSinceMonday || [],
  };

  if (stats.tasksSkippedSinceMonday) {
    statsToInclude.tasksSkippedSinceMonday = stats.tasksSkippedSinceMonday;
  }

  return statsToInclude as IGoalCompletedStats;
};

export const getFilteredGoalStats = async (goalId: string): Promise<IGoalCompletedStats | null> =>
  filterGoalStats(await getGoalCompletedStats(goalId));
