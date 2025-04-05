/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getGoal, getParticipantsOfGoals } from "@src/api/GoalsAPI";
import { getParticipantsOfDeletedGoal } from "@src/api/TrashAPI";
import { getHistoryUptoGoal } from "../helpers/GoalProcessor";
import { findParticipantTopLevelGoal } from "./GoalController";
import { findMostRecentSharedAncestor } from "../components/MoveGoal/MoveGoalHelper";

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

  const filteredSubscribers = subscribers.filter((ele) => !excludeSubs.includes(ele.sub.relId));

  if (goal) {
    const { participants, ...changes } = goal;
    filteredSubscribers.forEach(async ({ sub }) => {
      const recentParentGoalId = await findMostRecentSharedAncestor(goal.parentGoalId, sub.relId);

      sendUpdatesToSubscriber(sub, goalId, "modifiedGoals", [
        {
          level: ancestorGoalIds.length,
          goal: {
            ...changes,
            parentGoalId: recentParentGoalId,
            timestamp: Date.now(),
            participants: [],
          },
        },
      ])
        .then(() => console.log(`[sendUpdatedGoal] Update sent successfully to ${sub.relId}`))
        .catch((error) => console.error(`[sendUpdatedGoal] Error sending update to ${sub.relId}:`, error));
    });
  }
};

export const sendFinalUpdateOnGoal = async (
  goalId: string,
  action: "archived" | "deleted" | "restored" | "moved",
  ancestors: string[] = [],
  redefineAncestors = true,
  excludeSubs: string[] = [],
  timestamp: number = Date.now(),
) => {
  const goal = await getGoal(goalId);
  if (!goal) {
    return;
  }

  const goalParticipants = goal.participants;
  const ancestorGoalIds = redefineAncestors ? (await getHistoryUptoGoal(goalId)).map((ele) => ele.goalID) : ancestors;

  const subscribers = await getParticipantsOfGoals([]);

  if (action === "restored") {
    const deletedGoalParticipants = await getParticipantsOfDeletedGoal(goalId);
    subscribers.push(...deletedGoalParticipants);
  }

  const filteredSubscribers = goalParticipants?.filter((ele) => !excludeSubs.includes(ele.relId));

  filteredSubscribers?.forEach(async (participant) => {
    const rootGoal = await findParticipantTopLevelGoal(goalId, participant.relId);
    if (!rootGoal?.id) return;
    await sendUpdatesToSubscriber(participant, rootGoal.id, action, [
      { level: ancestorGoalIds.length, id: goalId, timestamp },
    ]);
  });
};
