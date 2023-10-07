import { GoalItem } from "@src/models/GoalItem";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSharedWMGoal, removeSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import {
  getGoal,
  addGoal,
  updateGoal,
  archiveUserGoal,
  removeGoalWithChildrens,
  getParticipantsOfGoals,
} from "@src/api/GoalsAPI";
import { addGoalToPartner } from "@src/api/PartnerAPI";
import { createGoalObjectFromTags } from "./GoalProcessor";

export const createGoal = async (
  parentGoalId: string,
  goalTags: GoalItem,
  goalTitle: string,
  goalColor: string,
  ancestors: string[],
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
) => {
  const level = ancestors.length;
  await updateGoal(goalId, {
    ...goalTags,
    title: goalTitle
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    goalColor,
  });
  const goal = await getGoal(goalId);
  const subscribers = await getParticipantsOfGoals(ancestors);
  if (goal) {
    subscribers.forEach(async ({ sub, rootGoalId }) => {
      sendUpdatesToSubscriber(sub, rootGoalId, "modifiedGoals", [{ level, goal }]).then(() =>
        console.log("update sent"),
      );
    });
  }
};

export const archiveGoal = async (goal: GoalItem, ancestors: string[]) => {
  const level = ancestors.length;
  const subscribers = await getParticipantsOfGoals(ancestors);
  subscribers.forEach(async ({ sub, rootGoalId }) => {
    sendUpdatesToSubscriber(sub, rootGoalId, "archived", [{ level, id: goal.id }]).then(() =>
      console.log("update sent"),
    );
  });
  await archiveUserGoal(goal);
};

export const deleteGoal = async (goal: GoalItem, ancestors: string[]) => {
  const level = ancestors.length;
  const subscribers = await getParticipantsOfGoals(ancestors);
  subscribers.forEach(async ({ sub, rootGoalId }) => {
    sendUpdatesToSubscriber(sub, rootGoalId, "deleted", [{ level, id: goal.id }]).then(() =>
      console.log("update sent"),
    );
  });
  await removeGoalWithChildrens(goal);
};

export const deleteSharedGoal = async (goal: GoalItem) => {
  // await Promise.all([removeSharedWMChildrenGoals(goal.id), removeGoalFromPartner(goal.shared.contacts[0].relId, goal)]);
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
