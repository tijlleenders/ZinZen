/* eslint-disable no-await-in-loop */
import { GoalItem } from "@src/models/GoalItem";
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
      .then((hints) => addHintItem(newGoal.id, hintOption, hints || []))
      .catch((error) => console.error("Error fetching hints:", error));
  }

  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    if (!parentGoal) return { parentGoal: null };
    const newGoalId = await addGoal(inheritParentProps(newGoal, parentGoal));

    const subscribers = await getParticipantsOfGoals(ancestors);
    if (newGoalId) {
      subscribers.map(async ({ sub, rootGoalId }) => {
        sendUpdatesToSubscriber(sub, rootGoalId, "subgoals", [
          {
            level,
            goal: { ...newGoal, id: newGoalId },
          },
        ]).then(() => console.log("update sent"));
      });
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

export const createSharedGoal = async (newGoal: GoalItem, parentGoalId: string, ancestors: string[]) => {
  const level = ancestors.length;

  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    if (!parentGoal) {
      console.log("Parent goal not found");
      return { parentGoal: null };
    }

    const newGoalId = newGoal.id;
    const subscribers = await getParticipantsOfGoals(ancestors);

    if (newGoalId) {
      subscribers.map(async ({ sub, rootGoalId }) => {
        await sendUpdatesToSubscriber(sub, rootGoalId, "newGoalMoved", [
          {
            level,
            goal: { ...newGoal, id: newGoalId, parentGoalId },
          },
        ]);
      });

      const descendants = await getAllDescendants(newGoalId);
      if (descendants.length > 0) {
        subscribers.map(async ({ sub, rootGoalId }) => {
          await sendUpdatesToSubscriber(
            sub,
            rootGoalId,
            "newGoalMoved",
            descendants.map((descendant) => ({
              level: level + 1,
              goal: {
                ...descendant,
                rootGoalId,
              },
            })),
          );
        });
      }

      console.log("Updates sent successfully");
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
  if (!goalToMove) return;

  const oldParentId = goalToMove.parentGoalId;
  const ancestors = await getGoalHistoryToRoot(goalId);
  const ancestorGoalIds = ancestors.map((ele) => ele.goalID);

  await Promise.all([
    updateGoal(goalToMove.id, { parentGoalId: newParentGoalId }),
    removeGoalFromParentSublist(goalToMove.id, oldParentId),
    addGoalToNewParentSublist(goalToMove.id, newParentGoalId),
    updateRootGoal(goalToMove.id, newParentGoal?.rootGoalId ?? "root"),
  ]);

  const subscribers = await getParticipantsOfGoals(ancestorGoalIds);
  subscribers.forEach(async ({ sub, rootGoalId }) => {
    await sendUpdatesToSubscriber(sub, rootGoalId, "moved", [
      {
        level: ancestorGoalIds.length,
        goal: {
          ...goalToMove,
          parentGoalId: newParentGoalId,
          rootGoalId,
        },
      },
    ]);
  });

  // Also send updates for all descendants
  const descendants = await getAllDescendants(goalId);
  if (descendants.length > 0) {
    subscribers.forEach(async ({ sub, rootGoalId }) => {
      await sendUpdatesToSubscriber(
        sub,
        rootGoalId,
        "moved",
        descendants.map((descendant) => ({
          level: ancestorGoalIds.length + 1,
          goal: {
            ...descendant,
            rootGoalId,
          },
        })),
      );
    });
  }
};
