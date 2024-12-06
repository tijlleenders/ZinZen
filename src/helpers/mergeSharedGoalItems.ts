import { getGoalById } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

export async function isIncomingGoalLatest(localGoalId: string, incomingGoal: GoalItem): Promise<boolean> {
  const localGoal = await getGoalById(localGoalId);

  if (!localGoal) {
    return true;
  }

  if (incomingGoal.timestamp > localGoal.timestamp) {
    return true;
  }

  return false;
}

export async function isIncomingIdChangeLatest(localGoalId: string, incomingChangeTimestamp: number): Promise<boolean> {
  const localGoal = await getGoalById(localGoalId);

  if (!localGoal) {
    return true;
  }

  return incomingChangeTimestamp > localGoal.timestamp;
}
