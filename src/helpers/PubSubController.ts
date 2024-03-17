/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getGoal, getParticipantsOfGoals } from "@src/api/GoalsAPI";
import { getHistoryUptoGoal } from "./GoalProcessor";

export const sendUpdatedGoal = async (
  goalId: string,
  ancestors: string[] = [],
  redefineAncestors = true,
  excludeSubs: string[] = [],
) => {
  const goal = await getGoal(goalId);
  if (!goal) {
    return;
  }
  const ancestorGoalIds = redefineAncestors ? (await getHistoryUptoGoal(goalId)).map((ele) => ele.goalID) : ancestors;
  const subscribers = await getParticipantsOfGoals(ancestorGoalIds);
  if (goal) {
    const { participants, ...changes } = goal;
    subscribers
      .filter((ele) => !excludeSubs.includes(ele.sub.relId))
      .forEach(async ({ sub, rootGoalId }) => {
        sendUpdatesToSubscriber(sub, rootGoalId, "modifiedGoals", [
          { level: ancestorGoalIds.length, goal: { ...changes, rootGoalId } },
        ]).then(() => console.log("update sent"));
      });
  }
};

export const sendFinalUpdateOnGoal = async (
  goalId: string,
  action: "archived" | "deleted",
  ancestors: string[] = [],
  redefineAncestors = true,
  excludeSubs: string[] = [],
) => {
  const ancestorGoalIds = redefineAncestors ? (await getHistoryUptoGoal(goalId)).map((ele) => ele.goalID) : ancestors;
  const subscribers = await getParticipantsOfGoals(ancestorGoalIds);
  subscribers
    .filter((ele) => !excludeSubs.includes(ele.sub.relId))
    .forEach(async ({ sub, rootGoalId }) => {
      sendUpdatesToSubscriber(sub, rootGoalId, action, [{ level: ancestorGoalIds.length, id: goalId }]).then(() =>
        console.log("update sent"),
      );
    });
};
