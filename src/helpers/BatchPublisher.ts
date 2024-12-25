/* eslint-disable no-restricted-syntax */
import { getGoal } from "@src/api/GoalsAPI";
import { getSharedRootGoal } from "@src/controllers/GoalController";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";

export const sendNewGoals = async (newGoals: GoalItem[], ancestors: string[] = [], excludeSubs: string[] = []) => {
  try {
    if (!newGoals.length) {
      return;
    }

    const newLocalGoals = await Promise.all(
      newGoals.map(async (goal) => {
        try {
          const goal1 = await getGoal(goal.id);
          if (!goal1) {
            return null;
          }
          return goal1;
        } catch (error) {
          return null;
        }
      }),
    );

    const validGoals = newLocalGoals.filter((goal): goal is GoalItem => goal !== null);

    const processGoals = async (validGoals: GoalItem[]) => {
      const subscriberUpdates = new Map<
        string,
        {
          sub: IParticipant;
          rootGoalId: string;
          updates: Array<{ level: number; goal: Omit<GoalItem, "participants"> }>;
        }
      >();

      for (const goal of validGoals) {
        const relevantParticipants = goal.participants.filter(
          (participant) => participant.following && !excludeSubs.includes(participant.relId),
        );

        for (const participant of relevantParticipants) {
          try {
            if (!subscriberUpdates.has(participant.relId)) {
              const rootGoal = await getSharedRootGoal(goal.id, participant.relId);
              subscriberUpdates.set(participant.relId, {
                sub: participant,
                rootGoalId: rootGoal?.id || goal.id,
                updates: [],
              });
            }

            const update = subscriberUpdates.get(participant.relId);
            if (update) {
              const { participants, ...changes } = goal;
              update.updates.push({ level: ancestors.length, goal: changes });
            }
          } catch (error) {
            console.error(`Error processing participant ${participant.relId}:`, error);
          }
        }
      }

      return subscriberUpdates;
    };

    const subscriberUpdates = await processGoals(validGoals);

    const updatePromises = Array.from(subscriberUpdates.entries()).map(
      async ([relId, { sub, rootGoalId, updates }]) => {
        try {
          console.log(`[sendNewGoals] Sending ${updates.length} updates to subscriber ${relId}`);
          await sendUpdatesToSubscriber(sub, rootGoalId, "subgoals", updates);
        } catch (error) {
          console.error(`[sendNewGoals] Error sending updates to subscriber ${relId}:`, error);
        }
      },
    );

    await Promise.all(updatePromises);
    console.log("[sendNewGoals] Successfully completed sending all updates");
  } catch (error) {
    console.error("[sendNewGoals] Error sending updates:", error);
    throw error;
  }
};
