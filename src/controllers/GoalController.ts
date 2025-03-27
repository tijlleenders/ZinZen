/* eslint-disable no-await-in-loop */
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { inheritParentProps } from "@src/utils";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSharedWMGoal, removeSharedWMGoalWithChildrens, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import {
  getGoal,
  addGoal,
  updateGoal,
  archiveUserGoal,
  removeGoalWithChildrens,
  getParticipantsOfGoals,
  getHintsFromAPI,
  getChildrenGoals,
} from "@src/api/GoalsAPI";
import { addHintItem, updateHintItem } from "@src/api/HintsAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { sendFinalUpdateOnGoal, sendUpdatedGoal } from "./PubSubController";

export const inheritParticipants = (parentGoal: GoalItem) => {
  const allParticipants = new Map<string, IParticipant>();

  if (parentGoal?.participants) {
    parentGoal.participants.forEach((participant) => {
      if (participant.following) {
        allParticipants.set(participant.relId, participant);
      }
    });
  }

  return Array.from(allParticipants.values());
};

/**
 * Recursively finds the top-level goal that a participant is associated with in the goal hierarchy.
 * A top-level goal is either:
 * 1. A root-level goal where the participant is directly listed
 * 2. The highest level goal in the hierarchy where the participant is listed
 *
 * @param {string} goalId - The ID of the goal to start searching from
 * @param {string} participantRelId - The relationship ID of the participant to find
 *
 * @returns {Promise<GoalItem | null>} Returns a Promise that resolves to:
 *   - The top-level GoalItem that the participant is associated with
 *   - The current goal if the parent goal doesn't exist or doesn't include the participant
 *   - null if the initial goal doesn't exist
 *
 * @example
 * const topLevelGoal = await findParticipantTopLevelGoal('goal123', 'participant456');
 * if (topLevelGoal) {
 *   console.log('Found top level goal:', topLevelGoal.title);
 * }
 */
export const findParticipantTopLevelGoal = async (
  goalId: string,
  participantRelId: string,
): Promise<GoalItem | null> => {
  const goal = await getGoal(goalId);
  if (!goal) {
    return null;
  }
  // if goal is root and participant is in participants list
  if (goal.parentGoalId === "root" && goal.participants.some((p) => p.relId === participantRelId)) {
    return goal;
  }

  if (goal.parentGoalId !== "root") {
    // if goal is not root, check for parent goal
    const parentGoal = await getGoal(goal.parentGoalId);
    if (!parentGoal) {
      return goal;
    }
    if (!parentGoal.participants.some((p) => p.relId === participantRelId)) {
      return goal;
    }
    return findParticipantTopLevelGoal(goal.parentGoalId, participantRelId);
  }
  return null;
};

export const getAllDescendants = async (goalId: string): Promise<GoalItem[]> => {
  const descendants: GoalItem[] = [];

  const processGoalAndChildren = async (currentGoalId: string) => {
    const childrenGoals = await getChildrenGoals(currentGoalId);
    await Promise.all(
      childrenGoals.map(async (childGoal) => {
        descendants.push(childGoal);
        await processGoalAndChildren(childGoal.id);
      }),
    );
  };

  await processGoalAndChildren(goalId);
  return descendants;
};

const sendNewGoalObject = async (
  newGoal: GoalItem,
  parentGoalId: string,
  ancestors: string[],
  changeType: "subgoals" | "newGoalMoved",
) => {
  const level = ancestors.length;
  const newGoalId = newGoal.id;
  const subscribers = await getParticipantsOfGoals(ancestors);
  const descendants = await getAllDescendants(newGoalId);

  if (newGoalId) {
    try {
      const subscriberUpdates = new Map<
        string,
        {
          sub: IParticipant;
          notificationGoalId: string;
          updates: Array<{ level: number; goal: GoalItem }>;
        }
      >();

      subscribers.forEach(({ sub, notificationGoalId }) => {
        subscriberUpdates.set(sub.relId, {
          sub,
          notificationGoalId,
          updates: [
            {
              level,
              goal: { ...newGoal, id: newGoalId, parentGoalId, participants: [] },
            },
          ],
        });
      });

      if (descendants.length > 0) {
        subscribers.forEach(({ sub, notificationGoalId }) => {
          const subscriberUpdate = subscriberUpdates.get(sub.relId);
          if (subscriberUpdate) {
            subscriberUpdate.updates.push(
              ...descendants.map((descendant) => ({
                level: level + 1,
                goal: {
                  ...descendant,
                  notificationGoalId,
                },
              })),
            );
          }
        });
      }

      await Promise.all(
        Array.from(subscriberUpdates.values()).map(({ sub, notificationGoalId, updates }) =>
          sendUpdatesToSubscriber(sub, notificationGoalId, changeType, updates),
        ),
      );
    } catch (error) {
      console.error("[createSharedGoal] Error sending updates:", error);
    }
  }
};

export const createGoal = async (newGoal: GoalItem, parentGoalId: string, ancestors: string[], hintOption: boolean) => {
  // handle hint
  if (hintOption) {
    getHintsFromAPI(newGoal)
      .then((hints) => {
        addHintItem(newGoal.id, hintOption, hints || []);
      })
      .catch((error) => console.error("Error fetching hints:", error));
  }

  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    if (!parentGoal) {
      console.warn("Parent goal not found:", parentGoalId);
      return { parentGoal: null };
    }

    const goalWithParentProps = inheritParentProps(newGoal, parentGoal);

    const updatedGoal = {
      ...goalWithParentProps,
      participants: inheritParticipants(parentGoal),
    };

    const newGoalId = await addGoal(updatedGoal);
    await sendNewGoalObject({ ...updatedGoal, id: newGoalId }, parentGoalId, ancestors, "subgoals");

    const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
    await updateGoal(parentGoalId, { sublist: newSublist });
    return { parentGoal };
  }

  await addGoal(newGoal);
  return { parentGoal: null };
};

export const getGoalAncestors = async (goalId: string): Promise<string[]> => {
  const ancestors: string[] = [];
  let currentGoalId = goalId;

  while (currentGoalId !== "root") {
    const currentGoal = await getGoal(currentGoalId);
    if (!currentGoal || currentGoal.parentGoalId === "root") break;

    ancestors.unshift(currentGoal.parentGoalId);
    currentGoalId = currentGoal.parentGoalId;
  }

  return ancestors;
};

export const createSharedGoalObjectForSending = async (
  newGoal: GoalItem,
  parentGoalId: string,
  ancestors: string[],
) => {
  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    if (!parentGoal) {
      return { parentGoal: null };
    }

    await sendNewGoalObject(newGoal, parentGoalId, ancestors, "newGoalMoved");
    return { parentGoal };
  }
  return { parentGoal: null };
};

export const modifyGoal = async (
  goalId: string,
  goalTags: GoalItem,
  ancestors: string[],
  hintOptionEnabled: boolean,
) => {
  if (hintOptionEnabled) {
    const availableHintsPromise = getHintsFromAPI(goalTags);
    availableHintsPromise
      .then((availableGoalHints) => updateHintItem(goalTags.id, hintOptionEnabled, availableGoalHints))
      .catch((err) => console.error("Error updating hints:", err));
  } else {
    updateHintItem(goalTags.id, hintOptionEnabled, []);
  }
  console.log(goalTags);
  await updateGoal(goalId, goalTags);
  sendUpdatedGoal(goalId, ancestors);
};

export const archiveGoal = async (goal: GoalItem, ancestors: string[]) => {
  sendFinalUpdateOnGoal(goal.id, "archived", ancestors, false).then(() => {
    console.log("Update Sent");
  });
  await archiveUserGoal(goal);
};

export const deleteGoal = async (goal: GoalItem, ancestors: string[]) => {
  sendFinalUpdateOnGoal(goal.id, "deleted", [...ancestors, goal.id], false).then(() => {
    console.log("Update Sent");
  });
  await removeGoalWithChildrens(goal);
};

export const restoreGoal = async (goal: GoalItem, ancestors: string[]) => {
  sendFinalUpdateOnGoal(goal.id, "restored", [...ancestors, goal.id], false).then(() => {
    console.log("Update Sent");
  });
  await restoreUserGoal(goal);
};

export const deleteSharedGoal = async (goal: GoalItem) => {
  await removeSharedWMGoalWithChildrens(goal);

  if (goal.parentGoalId !== "root") {
    getSharedWMGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
      const parentGoalSublist = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goal.id);

      if (childGoalIndex !== -1) {
        parentGoalSublist.splice(childGoalIndex, 1);
      }

      await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
    });
  }
};

export const updateRootGoal = async (goalId: string, newNotificationGoalId: string) => {
  await updateGoal(goalId, { notificationGoalId: newNotificationGoalId });

  const childrenGoals = await getChildrenGoals(goalId);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await updateRootGoal(goal.id, newNotificationGoalId);
    });
  }
};

export const getNotificationGoalId = async (goalId: string): Promise<string> => {
  const goal = await getGoal(goalId);
  if (!goal || goal.parentGoalId === "root") {
    return goal?.id || "root";
  }
  return getNotificationGoalId(goal.parentGoalId);
};

export const updateRootGoalNotification = async (goalId: string) => {
  console.trace("Updating root goal notification for goalId:", goalId);
  const notificationGoalId = await getNotificationGoalId(goalId);
  if (notificationGoalId !== "root") {
    await updateGoal(notificationGoalId, { newUpdates: true });
  }
};

export const removeGoalFromParentSublist = async (goalId: string, parentGoalId: string) => {
  const parentGoal = await getGoal(parentGoalId);
  if (!parentGoal) return;

  const parentGoalSublist = parentGoal.sublist;
  const childGoalIndex = parentGoalSublist.indexOf(goalId);
  if (childGoalIndex !== -1) {
    parentGoalSublist.splice(childGoalIndex, 1);
  }
  await updateGoal(parentGoal.id, { sublist: parentGoalSublist });
};

export const addGoalToNewParentSublist = async (goalId: string, newParentGoalId: string) => {
  const newParentGoal = await getGoal(newParentGoalId);
  if (!newParentGoal) return;

  const isGoalAlreadyInSublist = newParentGoal.sublist.includes(goalId);
  if (isGoalAlreadyInSublist) return;
  await updateGoal(newParentGoal.id, { sublist: [...newParentGoal.sublist, goalId] });
};

/**
 * Retrieves the hierarchical path of goals from a given goal to the root.
 * The function traverses up the goal tree, collecting each goal's ID and title
 * until it reaches the root goal.
 *
 * @param {string} goalId - The ID of the goal to start the traversal from
 * @returns {Promise<Array<{goalID: string, title: string}>>} An array of goal objects
 *          containing IDs and titles, ordered from root to the target goal
 *          (root's ancestors will be at the start of the array)
 *
 * @example
 * const history = await getGoalHistoryToRoot('goal123');
 * // Returns: [
 * //   { goalID: 'parentGoal', title: 'Parent Goal' },
 * //   { goalID: 'goal123', title: 'Current Goal' }
 * // ]
 */
export const getGoalHistoryToRoot = async (goalId: string): Promise<{ goalID: string; title: string }[]> => {
  const history: { goalID: string; title: string }[] = [];
  let currentGoalId = goalId;

  while (currentGoalId !== "root") {
    const currentGoal = await getGoal(currentGoalId);

    if (!currentGoal) {
      break;
    }

    history.unshift({ goalID: currentGoal.id, title: currentGoal.title });
    currentGoalId = currentGoal.parentGoalId;
  }

  return history;
};

export const mergeParticipants = (
  sourceParticipants: IParticipant[],
  targetParticipants?: IParticipant[],
): IParticipant[] => {
  const mergedParticipants = new Map<string, IParticipant>();

  sourceParticipants.forEach((participant) => {
    mergedParticipants.set(participant.relId, participant);
  });

  targetParticipants?.forEach((participant) => {
    mergedParticipants.set(participant.relId, participant);
  });

  return Array.from(mergedParticipants.values());
};

// we basically send the update to the shared goal
export const moveGoalHierarchy = async (goalId: string, newParentGoalId: string) => {
  const goalToMove = await getGoal(goalId);
  const newParentGoal = await getGoal(newParentGoalId);

  if (!goalToMove) return;

  // Special case: Moving to root
  if (newParentGoalId === "root") {
    try {
      // Update the goal to be at root level
      await updateGoal(goalToMove.id, {
        parentGoalId: "root",
        notificationGoalId: goalToMove.id, // When moving to root, the goal becomes its own notification root
      });

      // Remove from old parent's sublist
      const oldParentId = goalToMove.parentGoalId;
      if (oldParentId !== "root") {
        await removeGoalFromParentSublist(goalToMove.id, oldParentId);
      }

      // Update notificationGoalId for all descendants
      const descendants = await getAllDescendants(goalId);
      if (descendants.length > 0) {
        await Promise.all(
          descendants.map((descendantGoal) => {
            return updateGoal(descendantGoal.id, {
              notificationGoalId: goalToMove.id,
            });
          }),
        );
      }

      // Send updates to all participants
      await Promise.all(
        goalToMove.participants.map(async (participant) => {
          if (participant.following) {
            const rootGoal = await findParticipantTopLevelGoal(goalId, participant.relId);
            if (rootGoal) {
              const ancestors = await getGoalHistoryToRoot(goalId);
              const ancestorGoalIds = ancestors.map((ele) => ele.goalID);

              await sendUpdatesToSubscriber(participant, rootGoal.id, "modifiedGoals", [
                {
                  level: ancestorGoalIds.length,
                  goal: {
                    ...goalToMove,
                    parentGoalId: "root",
                    notificationGoalId: goalToMove.id,
                    participants: [],
                  },
                },
              ]);
            }
          }
        }),
      );

      console.log("[moveGoalHierarchy] Successfully moved goal to root level");
      return;
    } catch (error) {
      console.error("[moveGoalHierarchy] Error moving goal to root:", error);
      return;
    }
  }

  // update participants
  const updatedGoal = {
    ...goalToMove,
    notificationGoalId: newParentGoal?.notificationGoalId || "root",
  };

  const originalParticipants = newParentGoal?.participants;

  try {
    // For each participant in the new parent goal, check if they're already in the goalToMove
    await Promise.all(
      originalParticipants?.map(async (participant) => {
        const isAlreadyShared = goalToMove.participants.some((p) => p.relId === participant.relId && p.following);

        if (isAlreadyShared) {
          // If already shared, send update to this participant
          const rootGoal = await findParticipantTopLevelGoal(goalId, participant.relId);
          if (rootGoal) {
            const ancestors = await getGoalHistoryToRoot(goalId);
            const ancestorGoalIds = ancestors.map((ele) => ele.goalID);

            await sendUpdatesToSubscriber(participant, rootGoal.id, "modifiedGoals", [
              {
                level: ancestorGoalIds.length,
                goal: {
                  ...updatedGoal,
                  parentGoalId: newParentGoalId,
                  participants: [],
                },
              },
            ]);
          }
        } else {
          // If not shared, create a new shared goal object for this participant
          const goalsHistoryOfNewParent = await getGoalHistoryToRoot(newParentGoalId);
          const ancestorGoalIdsOfNewParent = goalsHistoryOfNewParent.map((ele) => ele.goalID);
          await createSharedGoalObjectForSending(updatedGoal, newParentGoalId, ancestorGoalIdsOfNewParent);
        }
      }) || [],
    );
  } catch (error) {
    console.error("[moveGoalHierarchy] Error handling participant updates:", error);
  }

  try {
    // update goal relationships
    const oldParentId = goalToMove.parentGoalId;
    await Promise.all([
      // update parent id to new parent and participants to the new parent participants
      updateGoal(goalToMove.id, {
        parentGoalId: newParentGoalId,
        participants: mergeParticipants(goalToMove.participants, newParentGoal?.participants),
      }),
      // remove goal from old parent's sublist
      removeGoalFromParentSublist(goalToMove.id, oldParentId),
      // add goal to new parent's sublist
      addGoalToNewParentSublist(goalToMove.id, newParentGoalId),
      // update root goal id
      updateRootGoal(goalToMove.id, newParentGoal?.notificationGoalId ?? "root"),
    ]);

    // update participants in descendants
    const descendants = await getAllDescendants(goalId);
    if (descendants.length > 0) {
      await Promise.all(
        descendants.map((descendantGoal) => {
          return updateGoal(descendantGoal.id, {
            notificationGoalId: newParentGoal?.notificationGoalId || "root",
            participants: mergeParticipants(descendantGoal.participants, newParentGoal?.participants),
          });
        }),
      );
    }
  } catch (error) {
    console.error("[moveGoalHierarchy] Error updating goal relationships:", error);
  }

  console.log("[moveGoalHierarchy] Successfully completed goal hierarchy move");
};
