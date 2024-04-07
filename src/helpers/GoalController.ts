import { GoalItem } from "@src/models/GoalItem";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";
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
} from "@src/api/GoalsAPI";
import { addHintItem, updateHintItem } from "@src/api/HintsAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { HintItem, IGoalHint } from "@src/models/HintItem";
import { createGoalObjectFromTags } from "./GoalProcessor";
import { sendFinalUpdateOnGoal, sendUpdatedGoal } from "./PubSubController";

export const createGoal = async (
  parentGoalId: string,
  goalTags: GoalItem,
  goalTitle: string,
  goalColor: string,
  ancestors: string[],
  goalHint: boolean,
) => {
  const level = ancestors.length;
  let newGoal = createGoalObjectFromTags({
    ...goalTags,
    title: goalTitle
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    language: getSelectedLanguage(),
    parentGoalId,
    goalColor,
  });

  if (goalHint === true) {
    const goalHintItem: HintItem = await getHintsFromAPI(newGoal);
    const hintsToAdd = goalHintItem.goalHints === undefined ? [] : goalHintItem.goalHints;
    await addHintItem(goalTags.id, goalHint, hintsToAdd);
  }

  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    if (!parentGoal) return { parentGoal: null };
    newGoal = inheritParentProps(newGoal, parentGoal);
    const newGoalId = await addGoal(newGoal);
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

export const modifyGoal = async (
  goalId: string,
  goalTags: GoalItem,
  goalTitle: string,
  goalColor: string,
  ancestors: string[],
  goalHint: boolean,
) => {
  let goalHints: IGoalHint[] = [];
  if (goalHint) {
    goalHints = await getHintsFromAPI({
      ...goalTags,
      title: goalTitle
        .split(" ")
        .filter((ele: string) => ele !== "")
        .join(" "),
      goalColor,
    });
  }
  await updateGoal(goalId, {
    ...goalTags,
    title: goalTitle
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    goalColor,
  });

  const sendUpdatedGoalPromise = sendUpdatedGoal(goalId, ancestors);
  const updateHintPromise = updateHintItem(goalTags.id, goalHint, goalHints);
  Promise.allSettled([sendUpdatedGoalPromise, updateHintPromise]).catch((err) => console.log(err));
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
