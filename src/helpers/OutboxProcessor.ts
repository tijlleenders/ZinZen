import { notifyNewColabRequest } from "@src/api/GoalsAPI";
import { addGoalsInSharedWM, archiveSharedWMGoal, getSharedWMGoal, removeSharedWMChildrenGoals, removeSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import { GoalItem } from "@src/models/GoalItem";

export const handleIncomingChanges = async (payload) => {
  if (payload.type === "shared") {
    if (payload.changeType === "subgoals") {
      await addGoalsInSharedWM([payload.changes[0].goal]);
    } else if (payload.changeType === "modifiedGoals") {
      await updateSharedWMGoal(payload.changes[0].goal.id, payload.changes[0].goal);
    } else if (payload.changeType === "deleted") {
      await removeSharedWMChildrenGoals(payload.changes[0].id);
      await removeSharedWMGoal(payload.changes[0].id);
      getSharedWMGoal(payload.changes[0].id).then((goal: GoalItem) => {
        if (goal.parentGoalId !== "root") {
          getSharedWMGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
            const parentGoalSublist = parentGoal.sublist;
            const childGoalIndex = parentGoalSublist.indexOf(goal.id);
            if (childGoalIndex !== -1) { parentGoalSublist.splice(childGoalIndex, 1); }
            await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
          });
        }
      });
    } else if (payload.changeType === "archived") {
      getSharedWMGoal(payload.changes[0].id).then((goal: GoalItem) => archiveSharedWMGoal(goal));
    }
  } else if (payload.type === "collaboration") {
    notifyNewColabRequest(payload.goal.id, payload.relId).catch(() => console.log("failed to notify about new colab"));
  }
};
