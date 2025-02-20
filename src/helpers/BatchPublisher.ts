/* eslint- no-restricted-syntax */
import { findParticipantTopLevelGoal } from "@src/controllers/GoalController";
import { GoalItem } from "@src/models/GoalItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";

export const sendNewGoals = async (newGoals: GoalItem[], ancestors: string[] = [], excludeSubs: string[] = []) => {
  try {
    newGoals.forEach((goal) => {
      goal.participants.forEach(async (participant) => {
        if (excludeSubs.includes(participant.relId) || !participant.following) return;
        const rootGoal = await findParticipantTopLevelGoal(goal.id, participant.relId);
        await sendUpdatesToSubscriber(participant, rootGoal?.id || goal.id, "subgoals", [
          {
            level: ancestors.length,
            goal: {
              ...goal,
              participants: [],
            },
          },
        ]);
      });
    });
  } catch (error) {
    console.error("[sendNewGoals] Error sending updates:", error);
  }
};
