import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { getGoal } from "@src/api/GoalsAPI";

// Shared function to find participant's top level goal
export const findParticipantTopLevelGoal = async (
  goalId: string,
  participantRelId: string,
): Promise<GoalItem | null> => {
  const goal = await getGoal(goalId);
  if (!goal) {
    return null;
  }
  // if goal is root and participant is in participants list
  if (goal.parentGoalId === "root" && goal.participants.some((p) => p.relId === participantRelId)) {
    return goal;
  }

  if (goal.parentGoalId !== "root") {
    // if goal is not root, check for parent goal
    const parentGoal = await getGoal(goal.parentGoalId);
    if (!parentGoal) {
      return goal;
    }
    if (!parentGoal.participants.some((p) => p.relId === participantRelId)) {
      return goal;
    }
    return findParticipantTopLevelGoal(goal.parentGoalId, participantRelId);
  }
  return null;
};
