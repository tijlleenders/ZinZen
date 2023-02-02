import { getGoal, addGoal, updateGoal, archiveUserGoal, removeChildrenGoals, removeGoal, removeGoalWithChildrens } from "@src/api/GoalsAPI";
import { getPubById } from "@src/api/PubSubAPI";
import { getSharedWMGoal, removeSharedWMChildrenGoals, removeSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import { ITags } from "@src/Interfaces/ITagExtractor";
import { GoalItem } from "@src/models/GoalItem";
import { sendUpdatesToSubscriber } from "@src/services/contact.service";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";
import { createGoalObjectFromTags, extractFromGoalTags } from "./GoalProcessor";

export const createGoal = async (
  parentGoalId: string, goalTags: ITags, goalTitle: string, goalColor: string, level: number
) => {
  let newGoal = createGoalObjectFromTags({
    title: goalTitle.split(" ").filter((ele:string) => ele !== "").join(" "),
    language: getSelectedLanguage(),
    parentGoalId,
    goalColor,
    ...extractFromGoalTags(goalTags)
  });

  if (parentGoalId && parentGoalId !== "root") {
    const parentGoal = await getGoal(parentGoalId);
    newGoal = inheritParentProps(newGoal, parentGoal);
    const newGoalId = await addGoal(newGoal);
    const pub = await getPubById(parentGoal.rootGoalId);
    if (pub && pub.subscribers.length > 0 && newGoalId) {
      sendUpdatesToSubscriber(pub, parentGoal.rootGoalId, "subgoals", [{
        level, goal: { ...newGoal, id: newGoalId } }]
      ).then(() => console.log("update sent"));
    }
    const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
    await updateGoal(parentGoalId, { sublist: newSublist });
    return { parentGoal };
  }
  await addGoal(newGoal);
  return { parentGoal: null };
};

export const modifyGoal = async (goalId: string, goalTags: ITags, goalTitle: string, goalColor: string, level: number) => {
  await updateGoal(goalId, {
    title: goalTitle.split(" ").filter((ele:string) => ele !== "").join(" "),
    goalColor,
    ...extractFromGoalTags(goalTags)
  });
  const goal = await getGoal(goalId);
  if (goal) {
    const pub = await getPubById(goal.rootGoalId);
    if (pub && pub.subscribers.length > 0) {
      sendUpdatesToSubscriber(pub, goal.rootGoalId, "modifiedGoals", [{ level, goal }])
        .then(() => console.log("update sent"));
    }
  }
};

export const archiveGoal = async (goal: GoalItem, level: number) => {
  const pub = await getPubById(goal.rootGoalId);
  if (pub && pub.subscribers.length > 0) {
    sendUpdatesToSubscriber(pub, goal.rootGoalId, "archived", [{ level, id: goal.id }])
      .then(() => console.log("update sent"));
  }
  await archiveUserGoal(goal);
};

export const deleteGoal = async (goal: GoalItem, level: number) => {
  const pub = await getPubById(goal.rootGoalId);
  if (pub && pub.subscribers.length > 0) {
    sendUpdatesToSubscriber(pub, goal.rootGoalId, "deleted", [{ level, id: goal.id }])
      .then(() => console.log("update sent"));
  }
  await removeGoalWithChildrens(goal);
};

export const deleteSharedGoal = async (goal: GoalItem) => {
  await removeSharedWMChildrenGoals(goal.id);
  await removeSharedWMGoal(goal.id);
  if (goal.parentGoalId !== "root") {
    getSharedWMGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
      const parentGoalSublist = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goal.id);
      if (childGoalIndex !== -1) { parentGoalSublist.splice(childGoalIndex, 1); }
      await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
    });
  }
};
