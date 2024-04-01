import { getParticipantsOfGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
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
  subscribers
    .filter((ele) => !excludeSubs.includes(ele.sub.relId))
    .forEach(async ({ sub, rootGoalId }) => {
      sendUpdatesToSubscriber(
        sub,
        rootGoalId,
        "subgoals",
        newGoals.map((goal) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { participants, ...changes } = goal;
          return { level: ancestorGoalIds.length, goal: { ...changes, rootGoalId } };
        }),
      ).then(() => console.log("update sent"));
    });
};
