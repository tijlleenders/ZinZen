import { getParticipantsOfGoals } from "@src/api/GoalsAPI";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getHistoryUptoGoal } from "./GoalProcessor";

export const sendNewGoals = async (
  newGoals: GoalItem[],
  ancestors: string[] = [],
  redefineAncestors = true,
  excludeSubs: string[] = [],
) => {
  const ancestorGoalIds = redefineAncestors
    ? (await getHistoryUptoGoal(newGoals[0].id)).map((ele) => ele.goalID)
    : ancestors;

  const subscribers = await getParticipantsOfGoals(ancestorGoalIds);

  try {
    const subscriberUpdates = new Map<
      string,
      {
        sub: IParticipant;
        rootGoalId: string;
        updates: Array<{ level: number; goal: Omit<GoalItem, "participants"> }>;
      }
    >();

    // Filter subscribers
    subscribers
      .filter(({ sub }) => !excludeSubs.includes(sub.relId))
      .forEach(({ sub, rootGoalId }) => {
        if (!subscriberUpdates.has(sub.relId)) {
          subscriberUpdates.set(sub.relId, {
            sub,
            rootGoalId,
            updates: newGoals.map((goal) => {
              const { participants, ...changes } = goal;
              return {
                level: ancestorGoalIds.length,
                goal: { ...changes, rootGoalId },
              };
            }),
          });
        }
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
