import { getGoal, addGoal, updateGoal, archiveUserGoal, removeChildrenGoals, removeGoal } from "@src/api/GoalsAPI";
import { ITags } from "@src/Interfaces/ITagExtractor";
import { GoalItem } from "@src/models/GoalItem";
import { sendColabUpdatesToContact } from "@src/services/contact.service";
import { getSelectedLanguage, inheritParentProps } from "@src/utils";
import { createGoalObjectFromTags, extractFromGoalTags } from "./GoalProcessor";

export const createGoal = async (
  parentGoalId: string, goalTags: ITags, goalTitle: string, goalColor: string
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
    const newGoalId = await addGoal({ ...newGoal, collaboration: { ...parentGoal.collaboration, notificationCounter: 0 } });
    if (parentGoal.collaboration.status === "accepted") {
      sendColabUpdatesToContact(parentGoal.collaboration.relId, parentGoalId, {
        type: "goalAdded",
        subgoals: [{
          ...newGoal,
          id: newGoalId,
          collaboration: { ...parentGoal.collaboration, allowed: false, notificationCounter: 0 }
        }]
      }).then(() => console.log("update sent"));
    }
    const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
    await updateGoal(parentGoalId, { sublist: newSublist });
    // @ts-ignore
    if (selectedGoalId !== parentGoalId) { addInHistory(parentGoal); }
  } else { await addGoal(newGoal); }
};

export const modifyGoal = async (goalId: string, goalTags: ITags, goalTitle: string, goalColor: string) => {
  await updateGoal(goalId, {
    title: goalTitle.split(" ").filter((ele:string) => ele !== "").join(" "),
    goalColor,
    ...extractFromGoalTags(goalTags)
  });
  getGoal(goalId).then((goal: GoalItem) => {
    if (goal.collaboration.status) {
      sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
        type: "goalEdited",
        updates: [goal]
      }).then(() => { console.log("edit updates sent"); });
    }
  });
};

export const archiveGoal = async (goal: GoalItem) => {
  await archiveUserGoal(goal);
  if (goal.collaboration.status) {
    sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
      type: "goalCompleted",
      completed: [goal]
    }).then(() => console.log("complete update sent"));
  }
};

export const deleteGoal = async (goal: GoalItem) => {
  if (goal.collaboration.status) {
    sendColabUpdatesToContact(goal.collaboration.relId, goal.id, {
      type: "goalDeleted",
      deletedGoals: [goal]
    }).then(() => console.log("update sent"));
  }
  await removeChildrenGoals(goal.id);
  await removeGoal(goal.id);
};
