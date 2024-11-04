/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getGoal, getParticipantsOfGoals } from "@src/api/GoalsAPI";
import { getParticipantsOfDeletedGoal } from "@src/api/TrashAPI";
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
          { level: ancestorGoalIds.length, goal: { ...changes, rootGoalId, participants: [] } },
        ]).then(() => console.log("update sent"));
      });
  }
};

export const sendFinalUpdateOnGoal = async (
  goalId: string,
  action: "archived" | "deleted" | "restored" | "moved",
  ancestors: string[] = [],
  redefineAncestors = true,
  excludeSubs: string[] = [],
) => {
  console.log(`[sendFinalUpdateOnGoal] Starting for goalId: ${goalId}, action: ${action}`);

  const ancestorGoalIds = redefineAncestors ? (await getHistoryUptoGoal(goalId)).map((ele) => ele.goalID) : ancestors;
  console.log("[sendFinalUpdateOnGoal] Ancestor IDs:", ancestorGoalIds);

  const subscribers = await getParticipantsOfGoals(ancestorGoalIds);
  console.log("[sendFinalUpdateOnGoal] Initial subscribers:", subscribers.length);

  if (action === "restored") {
    const deletedGoalParticipants = await getParticipantsOfDeletedGoal(goalId);
    console.log("[sendFinalUpdateOnGoal] Additional restored participants:", deletedGoalParticipants.length);
    deletedGoalParticipants.forEach((doc) => {
      subscribers.push(doc);
    });
  }

  const filteredSubscribers = subscribers.filter((ele) => !excludeSubs.includes(ele.sub.relId));
  console.log("[sendFinalUpdateOnGoal] Filtered subscribers:", filteredSubscribers.length);

  filteredSubscribers.forEach(async ({ sub, rootGoalId }) => {
    console.log(`[sendFinalUpdateOnGoal] Sending update to subscriber ${sub.relId} for root goal ${rootGoalId}`);
    sendUpdatesToSubscriber(sub, rootGoalId, action, [{ level: ancestorGoalIds.length, id: goalId }])
      .then(() => console.log(`[sendFinalUpdateOnGoal] Update sent successfully to ${sub.relId}`))
      .catch((error) => console.error(`[sendFinalUpdateOnGoal] Error sending update to ${sub.relId}:`, error));
  });
};
