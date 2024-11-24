/* eslint-disable no-await-in-loop */
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { inheritParentProps } from "@src/utils";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSharedWMGoal, removeSharedWMChildrenGoals, updateSharedWMGoal } from "@src/api/SharedWMAPI";
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

export const createGoal = async (newGoal: GoalItem, parentGoalId: string, ancestors: string[], hintOption: boolean) => {
  const level = ancestors.length;

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

    const ancestorGoals = await Promise.all(ancestors.map((id) => getGoal(id)));
    const allParticipants = new Map<string, IParticipant>();

    [...ancestorGoals, parentGoal].forEach((goal) => {
      if (!goal?.participants) return;
      goal.participants.forEach((participant) => {
        if (participant.following) {
          allParticipants.set(participant.relId, participant);
        }
      });
    });
    const goalWithParentProps = inheritParentProps(newGoal, parentGoal);
    const updatedGoal = {
      ...goalWithParentProps,
      participants: Array.from(allParticipants.values()),
    };

    const newGoalId = await addGoal(updatedGoal);

    if (newGoalId) {
      const subscribers = await getParticipantsOfGoals(ancestors);
      await Promise.all(
        subscribers.map(async ({ sub, rootGoalId }) => {
          await sendUpdatesToSubscriber(sub, rootGoalId, "subgoals", [
            {
              level,
              goal: {
                ...updatedGoal,
                id: newGoalId,
                rootGoalId,
              },
            },
          ]);
        }),
      );
    }

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

export const createSharedGoalObjectForSending = async (
  newGoal: GoalItem,
  parentGoalId: string,
  ancestors: string[],
) => {
  const level = ancestors.length;

  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    if (!parentGoal) {
      return { parentGoal: null };
    }

    const newGoalId = newGoal.id;
    const subscribers = await getParticipantsOfGoals(ancestors);
    const descendants = await getAllDescendants(newGoalId);

    if (newGoalId) {
      try {
        const subscriberUpdates = new Map<
          string,
          {
            sub: IParticipant;
            rootGoalId: string;
            updates: Array<{ level: number; goal: Omit<GoalItem, "participants"> }>;
          }
        >();

        subscribers.forEach(({ sub, rootGoalId }) => {
          subscriberUpdates.set(sub.relId, {
            sub,
            rootGoalId,
            updates: [
              {
                level,
                goal: { ...newGoal, id: newGoalId, parentGoalId },
              },
            ],
          });
        });

        if (descendants.length > 0) {
          subscribers.forEach(({ sub, rootGoalId }) => {
            const subscriberUpdate = subscriberUpdates.get(sub.relId);
            if (subscriberUpdate) {
              subscriberUpdate.updates.push(
                ...descendants.map((descendant) => ({
                  level: level + 1,
                  goal: {
                    ...descendant,
                    rootGoalId,
                  },
                })),
              );
            }
          });
        }

        await Promise.all(
          Array.from(subscriberUpdates.values()).map(({ sub, rootGoalId, updates }) =>
            sendUpdatesToSubscriber(sub, rootGoalId, "newGoalMoved", updates),
          ),
        );
      } catch (error) {
        console.error("[createSharedGoal] Error sending updates:", error);
      }
    }
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
  await removeSharedWMChildrenGoals(goal.id);
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

const updateRootGoal = async (goalId: string, newRootGoalId: string) => {
  await updateGoal(goalId, { rootGoalId: newRootGoalId });

  const childrenGoals = await getChildrenGoals(goalId);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await updateRootGoal(goal.id, newRootGoalId);
    });
  }
};

export const getRootGoalId = async (goalId: string): Promise<string> => {
  const goal = await getGoal(goalId);
  if (!goal || goal.parentGoalId === "root") {
    return goal?.id || "root";
  }
  return getRootGoalId(goal.parentGoalId);
};

export const updateRootGoalNotification = async (goalId: string) => {
  const rootGoalId = await getRootGoalId(goalId);
  if (rootGoalId !== "root") {
    await updateGoal(rootGoalId, { newUpdates: true });
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

  const newParentGoalSublist = newParentGoal.sublist;
  newParentGoalSublist.push(goalId);
  await updateGoal(newParentGoal.id, { sublist: newParentGoalSublist });
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

export const moveGoalHierarchy = async (goalId: string, newParentGoalId: string) => {
  const goalToMove = await getGoal(goalId);
  const newParentGoal = await getGoal(newParentGoalId);

  if (!goalToMove) {
    return;
  }

  const oldParentId = goalToMove.parentGoalId;
  const ancestors = await getGoalHistoryToRoot(goalId);
  const ancestorGoalIds = ancestors.map((ele) => ele.goalID);

  const ancestorGoalsOfNewParent = await getGoalHistoryToRoot(newParentGoalId);
  const ancestorGoalIdsOfNewParent = ancestorGoalsOfNewParent.map((ele) => ele.goalID);

  const ancestorGoals = await Promise.all(ancestorGoalIdsOfNewParent.map((id) => getGoal(id)));
  const allParticipants = new Map<string, IParticipant>();

  [...ancestorGoals, newParentGoal].forEach((goal) => {
    if (!goal?.participants) return;
    goal.participants.forEach((participant) => {
      if (participant.following) {
        allParticipants.set(participant.relId, participant);
      }
    });
  });

  goalToMove.participants.forEach((participant) => {
    if (participant.following) {
      allParticipants.set(participant.relId, participant);
    }
  });

  const updatedGoal = {
    ...goalToMove,
    participants: Array.from(allParticipants.values()),
  };

  const isNonSharedGoal = !goalToMove?.participants?.some((p) => p.following);

  if (isNonSharedGoal) {
    await createSharedGoalObjectForSending(updatedGoal, newParentGoalId, ancestorGoalIdsOfNewParent);
  } else {
    const subscribers = await getParticipantsOfGoals(ancestorGoalIds);

    try {
      await Promise.all(
        subscribers.map(({ sub, rootGoalId }) =>
          sendUpdatesToSubscriber(sub, rootGoalId, "moved", [
            {
              level: ancestorGoalIds.length,
              goal: {
                ...updatedGoal,
                parentGoalId: newParentGoalId,
                rootGoalId,
              },
            },
          ]),
        ),
      );
    } catch (error) {
      console.error("[moveGoalHierarchy] Error sending move updates:", error);
    }
  }

  try {
    await Promise.all([
      updateGoal(goalToMove.id, {
        parentGoalId: newParentGoalId,
        participants: updatedGoal.participants,
      }),
      removeGoalFromParentSublist(goalToMove.id, oldParentId),
      addGoalToNewParentSublist(goalToMove.id, newParentGoalId),
      updateRootGoal(goalToMove.id, newParentGoal?.rootGoalId ?? "root"),
    ]);

    const descendants = await getAllDescendants(goalId);
    if (descendants.length > 0) {
      await Promise.all(
        descendants.map((descendant) =>
          updateGoal(descendant.id, {
            participants: updatedGoal.participants,
            rootGoalId: newParentGoal?.rootGoalId ?? "root",
          }),
        ),
      );
    }
  } catch (error) {
    console.error("[moveGoalHierarchy] Error updating goal relationships:", error);
  }

  console.log("[moveGoalHierarchy] Successfully completed goal hierarchy move");
};
