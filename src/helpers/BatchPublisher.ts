import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";

export const sendNewGoals = async (newGoals: GoalItem[], ancestors: string[] = [], excludeSubs: string[] = []) => {
  try {
    const newGoals1 = await Promise.all(
      newGoals.map(async (goal) => {
        const goal1 = await getGoal(goal.id);
        if (!goal1) {
          return null;
        }
        return goal1;
      }),
    );

    const validGoals = newGoals1.filter((goal): goal is GoalItem => goal !== null);

    const subscriberUpdates = new Map<
      string,
      {
        sub: IParticipant;
        rootGoalId: string;
        updates: Array<{ level: number; goal: Omit<GoalItem, "participants"> }>;
      }
    >();

    validGoals.forEach((goal) => {
      goal.participants
        .filter((participant) => {
          const isFollowing = participant.following;
          const isNotExcluded = !excludeSubs.includes(participant.relId);
          return isFollowing && isNotExcluded;
        })
        .forEach((participant) => {
          if (!subscriberUpdates.has(participant.relId)) {
            subscriberUpdates.set(participant.relId, {
              sub: participant,
              rootGoalId: goal.rootGoalId,
              updates: [],
            });
          }

          const update = subscriberUpdates.get(participant.relId);
          if (update) {
            const { participants, ...changes } = goal;
            const level = ancestors.length;
            update.updates.push({
              level,
              goal: { ...changes, rootGoalId: goal.rootGoalId },
            });
          }
        });
    });

    await Promise.all(
      Array.from(subscriberUpdates.values()).map(({ sub, rootGoalId, updates }) =>
        sendUpdatesToSubscriber(sub, rootGoalId, "subgoals", updates),
      ),
    );
  } catch (error) {
    console.error("[sendNewGoals] Error sending updates:", error);
  }
};
