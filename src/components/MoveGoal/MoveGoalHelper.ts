/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line no-await-in-loop

import { getGoal, updateGoal, updateTimestamp } from "@src/api/GoalsAPI";
import { deleteSharedGoalMetadata } from "@src/api/SharedGoalNotMoved";
import {
  addGoalToNewParentSublist,
  findParticipantTopLevelGoal,
  getGoalHistoryToRoot,
  removeGoalFromParentSublist,
} from "@src/controllers/GoalController";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { createSharedGoalObject } from "@src/utils/sharedGoalUtils";

export const findMostRecentSharedAncestor = async (parentGoalId: string, participantRelId: string): Promise<string> => {
  const goalIds: string[] = [];
  let currentGoalId = parentGoalId;

  // First collect all goal IDs up to root
  while (currentGoalId !== "root") {
    goalIds.push(currentGoalId);
    const currentGoal = await getGoal(currentGoalId);
    if (!currentGoal) break;
    currentGoalId = currentGoal.parentGoalId;
  }

  // Then fetch all goals in a single batch
  const goals = await Promise.all(goalIds.map((id) => getGoal(id)));

  // Find the first shared ancestor
  const sharedIndex = goals.findIndex((goal) =>
    goal?.participants?.some((p) => p.relId === participantRelId && p.following),
  );

  if (sharedIndex !== -1) {
    return goalIds[sharedIndex];
  }

  return "root";
};

// Function to handle local goal move
const handleLocalGoalMove = async (goalToMove: GoalItem, newParentGoalId: string) => {
  const oldParentId = goalToMove.parentGoalId;

  await updateTimestamp(goalToMove.id);

  // Update goal relationships
  await Promise.all([
    updateGoal(goalToMove.id, {
      parentGoalId: newParentGoalId,
    }),
    removeGoalFromParentSublist(goalToMove.id, oldParentId),
    addGoalToNewParentSublist(goalToMove.id, newParentGoalId),
  ]);

  await deleteSharedGoalMetadata(goalToMove.id);
};

// Function to send updates to participants
const sendUpdatesToParticipants = async (updatedGoal: GoalItem, newParentGoalId: string, isRootMove = false) => {
  const { participants } = updatedGoal;

  await Promise.all(
    participants?.map(async (participant: IParticipant) => {
      if (!participant.following) return; // TODO: comeback to this later

      // TODO: try to check if this can be purely handled in reciever side
      const rootGoal = await findParticipantTopLevelGoal(updatedGoal.id, participant.relId);

      const ancestors = await getGoalHistoryToRoot(updatedGoal.id);
      const ancestorGoalIds = ancestors.map((ele) => ele.goalID);

      // For root move, use root as parent
      // For regular move, find the most recent shared ancestor for this participant
      const parentGoalId = isRootMove ? "root" : await findMostRecentSharedAncestor(newParentGoalId, participant.relId);

      const sharedGoal = createSharedGoalObject(updatedGoal);

      await sendUpdatesToSubscriber(participant, rootGoal?.id || updatedGoal.id, "modifiedGoals", [
        {
          level: ancestorGoalIds.length,
          goal: {
            ...sharedGoal,
            parentGoalId,
          },
        },
      ]);
    }) || [],
  );
};

// Main function to handle goal hierarchy move
export const moveGoalHierarchy = async (goalId: string, newParentGoalId: string) => {
  const goalToMove = await getGoal(goalId);
  // const newParentGoal = await getGoal(newParentGoalId);

  if (!goalToMove) return;

  try {
    // Handle root move case
    if (newParentGoalId === "root") {
      await handleLocalGoalMove(goalToMove, "root");
      sendUpdatesToParticipants(goalToMove, "root", true);
      return;
    }

    // First handle local move
    await handleLocalGoalMove(goalToMove, newParentGoalId);

    const updatedGoal = await getGoal(goalId);

    if (!updatedGoal) return;

    // Then send updates to participants
    sendUpdatesToParticipants(updatedGoal, newParentGoalId);

    console.log("[moveGoalHierarchy] Successfully completed goal hierarchy move");
  } catch (error) {
    console.error("[moveGoalHierarchy] Error in moveGoalHierarchy:", error);
  }
};
