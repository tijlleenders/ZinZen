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
import { addHintRecord, updateHintItem } from "@src/api/HintRecordAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { createGoalObjectFromTags } from "./GoalProcessor";
import { sendFinalUpdateOnGoal, sendUpdatedGoal } from "./PubSubController";
import { addSubGoalHint } from "@src/api/SubGoalHintAPI";
import { v4 as uuidv4 } from "uuid";
import { duration } from "moment";

export const createGoal = async (goalTags: GoalItem, parentGoalId: string, ancestors: string[], goalHint: boolean) => {
  const level = ancestors.length;
  let newGoal = createGoalObjectFromTags({
    ...goalTags,
    language: getSelectedLanguage(),
  });

  // if (goalHint) {
  //   getHintsFromAPI(newGoal).then((hint) => {

  //     addHintRecord(goalTags.id).then(() => addSubGoalHint(goalTags.id)).catch((error) => console.error("Error fetching hints:", error));
  //   });
  // }

  if (goalHint) {
    const hints = await getHintsFromAPI(newGoal);
    const hintRecordId = await addHintRecord(goalTags.id);
    if (!hintRecordId) return { hintRecordId: null };
    const subGoalHints = hints.map((hint) => ({
      id: uuidv4(),
      hintRecordId,
      duration: hint.duration?.toString() || null,
      isDeleted: false,
      parentGoalTitle: hint.parentTitle,
    }));
    await Promise.all(subGoalHints.map(addSubGoalHint));
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

export const modifyGoal = async (goalId: string, goalTags: GoalItem, ancestors: string[], goalHint: boolean) => {
  const hintsPromise = getHintsFromAPI(goalTags);
  if (goalHint) {
    hintsPromise
      .then((hints) => updateHintItem(goalTags.id, goalHint, hints))
      .catch((err) => console.error("Error updating hints:", err));
  } else {
    updateHintItem(goalTags.id, goalHint, []);
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
