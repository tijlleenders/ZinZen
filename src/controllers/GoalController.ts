/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { inheritParentProps } from "@src/utils";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { createSharedGoalObject } from "@src/utils/sharedGoalUtils";
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
  updateTimestamp,
} from "@src/api/GoalsAPI";
import { filterDeletedHints } from "@src/api/HintsAPI";
import { IGoalHint } from "@src/models/HintItem";
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
  changeType: "subgoals",
) => {
  const level = ancestors.length;
  const newGoalId = newGoal.id;
  const subscribers = await getParticipantsOfGoals(ancestors);
  const descendants = await getAllDescendants(newGoalId);

  const parentGoal = await getGoal(parentGoalId);

  if (!parentGoal) {
    console.log("parentGoal not found", parentGoalId);
    return;
  }

  const { participants } = parentGoal;
  console.log("participants", participants);

  if (!newGoalId) {
    console.log("newGoalId is missing");
    return;
  }

  try {
    const subscriberUpdates = new Map<
      string,
      {
        sub: IParticipant;
        notificationGoalId: string;
        updates: Array<{ level: number; goal: GoalItem }>;
      }
    >();

    // Process all participants in parallel and wait for completion
    await Promise.all(
      participants.map(async (sub) => {
        const rootGoal = await findParticipantTopLevelGoal(newGoalId, sub.relId);
        if (!rootGoal) {
          console.log(`No root goal found for participant ${sub.relId}`);
          return;
        }

        const sharedGoal = createSharedGoalObject(newGoal);
        subscriberUpdates.set(sub.relId, {
          sub,
          notificationGoalId: rootGoal.id || newGoalId,
          updates: [
            {
              level,
              goal: { ...sharedGoal, id: newGoalId, parentGoalId },
            },
          ],
        });
      }),
    );

    // Add descendants if any exist
    if (descendants.length > 0) {
      subscribers.forEach(({ sub, notificationGoalId }) => {
        const subscriberUpdate = subscriberUpdates.get(sub.relId);
        if (subscriberUpdate) {
          subscriberUpdate.updates.push(
            ...descendants.map((descendant) => {
              const sharedDescendant = createSharedGoalObject(descendant);
              return {
                level: level + 1,
                goal: {
                  ...sharedDescendant,
                  notificationGoalId,
                },
              };
            }),
          );
        }
      });
    }

    // Send updates to all subscribers
    const updatePromises = Array.from(subscriberUpdates.values()).map(({ sub, notificationGoalId, updates }) =>
      sendUpdatesToSubscriber(sub, notificationGoalId, changeType, updates)
        .then(() => console.log(`Update sent successfully to ${sub.relId}`))
        .catch((error) => console.error(`Error sending update to ${sub.relId}:`, error)),
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("[sendNewGoalObject] Error sending updates:", error);
  }
};

export const createGoal = async (newGoal: GoalItem, parentGoalId: string, ancestors: string[], hintOption: boolean) => {
  // handle hint

  let availableGoalHints: IGoalHint[] = [];
  if (newGoal.hints?.hintOptionEnabled) {
    availableGoalHints = await getHintsFromAPI(newGoal);
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

    const newGoalId = await addGoal({
      ...updatedGoal,
      hints: { ...newGoal.hints, hintOptionEnabled: hintOption, availableGoalHints },
    });

    sendNewGoalObject({ ...updatedGoal, id: newGoalId }, parentGoalId, ancestors, "subgoals");

    const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
    await updateGoal(parentGoalId, { sublist: newSublist });
    return { parentGoal };
  }

  await addGoal({ ...newGoal, hints: { ...newGoal.hints, hintOptionEnabled: hintOption, availableGoalHints } });
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

export const modifyGoal = async (
  goalId: string,
  goalTags: GoalItem,
  ancestors: string[],
  hintOptionEnabled: boolean,
) => {
  let availableGoalHints: IGoalHint[] = [];
  if (goalTags.hints?.hintOptionEnabled) {
    availableGoalHints = await getHintsFromAPI(goalTags);
  }
  const deletedHints = goalTags.hints?.deletedGoalHints;
  availableGoalHints = filterDeletedHints(availableGoalHints, deletedHints);

  await updateGoal(goalId, {
    ...goalTags,
    hints: { ...goalTags.hints, hintOptionEnabled, availableGoalHints },
  });
  await updateTimestamp(goalId);

  sendUpdatedGoal(goalId, ancestors);
};

export const archiveGoal = async (goal: GoalItem, ancestors: string[]) => {
  sendFinalUpdateOnGoal(goal.id, "archived", ancestors, false).then(() => {
    console.log("Update Sent");
  });
  await archiveUserGoal(goal);
};

export const deleteGoal = async (goal: GoalItem) => {
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

export const getNotificationGoalId = async (goalId: string): Promise<string | null> => {
  const goal = await getGoal(goalId);
  if (!goal || goal.parentGoalId === "root") {
    return goal?.id || null;
  }
  return getNotificationGoalId(goal.parentGoalId);
};

export const updateRootGoalNotification = async (goalId: string) => {
  const notificationGoalId = await getNotificationGoalId(goalId);

  if (!notificationGoalId) {
    console.log("Notification goal id not found", goalId);
    return;
  }

  await updateGoal(notificationGoalId, { newUpdates: true });
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
