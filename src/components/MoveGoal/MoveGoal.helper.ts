import { getGoal, updateGoal } from "@src/api/GoalsAPI";
import { deleteSharedGoalMetadata } from "@src/api/SharedGoalNotMoved";
import {
  addGoalToNewParentSublist,
  findParticipantTopLevelGoal,
  getGoalHistoryToRoot,
  removeGoalFromParentSublist,
} from "@src/controllers/GoalController";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { GoalItem, IParticipant } from "@src/models/GoalItem";

/**
 * Finds the most recent ancestor goal that is shared with a specific participant.
 * Traverses up the goal hierarchy until it finds a goal that is shared with the participant
 * or reaches the root level.
 *
 * @param goalId - The ID of the goal to start searching from
 * @param participantRelId - The relationship ID of the participant to check sharing with
 * @returns Promise<string> - The ID of the most recent shared ancestor goal, or "root" if none found
 *
 * @example
 * // Given the following goal hierarchy:
 * // root
 * // └── goalA (shared with participant "user1")
 * //     └── goalB
 * //         └── goalC
 *
 * const ancestorId = await findMostRecentSharedAncestor("goalC", "user1");
 * console.log(ancestorId); // Output: "goalA"
 */
export const findMostRecentSharedAncestor = async (goalId: string, participantRelId: string): Promise<string> => {
  let currentGoalId = goalId;

  while (currentGoalId !== "root") {
    const currentGoal = await getGoal(currentGoalId);
    if (!currentGoal) break;

    // Check if this goal is shared with the participant
    if (currentGoal.participants?.some((p) => p.relId === participantRelId && p.following)) {
      return currentGoalId;
    }

    currentGoalId = currentGoal.parentGoalId;
  }

  return "root";
};

// Function to handle local goal move
const handleLocalGoalMove = async (goalToMove: GoalItem, newParentGoalId: string) => {
  const oldParentId = goalToMove.parentGoalId;

  // Update goal relationships
  await Promise.all([
    updateGoal(goalToMove.id, {
      parentGoalId: newParentGoalId,
    }),
    removeGoalFromParentSublist(goalToMove.id, oldParentId),
    addGoalToNewParentSublist(goalToMove.id, newParentGoalId),
  ]);

  // Update descendants
  //   const descendants = await getAllDescendants(goalToMove.id);
  //   if (descendants.length > 0) {
  //     await Promise.all(
  //       descendants.map((descendantGoal) =>
  //         updateGoal(descendantGoal.id, {
  //           notificationGoalId: newParentGoalId,
  //         }),
  //       ),
  //     );
  //   }

  await deleteSharedGoalMetadata(goalToMove.id);
};

// Function to send updates to participants
const sendUpdatesToParticipants = async (
  updatedGoal: GoalItem,
  newParentGoalId: string,
  isRootMove: boolean = false,
) => {
  const participants = updatedGoal.participants;

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

      await sendUpdatesToSubscriber(participant, rootGoal?.id || updatedGoal.id, "modifiedGoals", [
        {
          level: ancestorGoalIds.length,
          goal: {
            ...updatedGoal,
            parentGoalId,
            participants: [],
          },
        },
      ]);
    }) || [],
  );
};

// Main function to handle goal hierarchy move
export const moveGoalHierarchy = async (goalId: string, newParentGoalId: string) => {
  const goalToMove = await getGoal(goalId);
  //const newParentGoal = await getGoal(newParentGoalId);

  if (!goalToMove) return;

  try {
    // Handle root move case
    if (newParentGoalId === "root") {
      await handleLocalGoalMove(goalToMove, "root");
      await sendUpdatesToParticipants(goalToMove, "root", true);
      console.log("[moveGoalHierarchy] Successfully moved goal to root level");
      return;
    }

    // First handle local move
    await handleLocalGoalMove(goalToMove, newParentGoalId);

    const updatedGoal = await getGoal(goalId);

    if (!updatedGoal) return;

    // Then send updates to participants
    await sendUpdatesToParticipants(updatedGoal, newParentGoalId);

    console.log("[moveGoalHierarchy] Successfully completed goal hierarchy move");
  } catch (error) {
    console.error("[moveGoalHierarchy] Error in moveGoalHierarchy:", error);
  }
};
