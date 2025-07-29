/* eslint- no-restricted-syntax */
import { findParticipantTopLevelGoal } from "@src/controllers/GoalController";
import { GoalItem } from "@src/models/GoalItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { createSharedGoalObject } from "@src/utils/sharedGoalUtils";

export const sendNewGoals = async (newGoals: GoalItem[], ancestors: string[] = [], excludeSubs: string[] = []) => {
  try {
    newGoals.forEach((goal) => {
      goal.participants.forEach(async (participant) => {
        if (excludeSubs.includes(participant.relId) || !participant.following) return;
        const rootGoal = await findParticipantTopLevelGoal(goal.id, participant.relId);
        const sharedGoal = createSharedGoalObject(goal);
        await sendUpdatesToSubscriber(participant, rootGoal?.id || goal.id, "subgoals", [
          {
            level: ancestors.length,
            goal: sharedGoal,
          },
        ]);
      });
    });
  } catch (error) {
    console.error("[sendNewGoals] Error sending updates:", error);
  }
};
