import { addGoalsInSharedWM, archiveSharedWMGoal, getSharedWMGoal, removeSharedWMChildrenGoals, removeSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";
import { GoalItem } from "@src/models/GoalItem";

export const handleIncomingChanges = async (payload) => {
  if (payload.type === "shared") {
    if (payload.typeOfChanges === "subgoals") {
      await addGoalsInSharedWM(payload.changes);
    } else if (payload.typeOfChanges === "modifiedGoals") {
      await updateSharedWMGoal(payload.changes[0].id, payload.changes[0]);
    } else if (payload.typeOfChanges === "deletedGoals") {
      await removeSharedWMChildrenGoals(payload.changes[0]);
      await removeSharedWMGoal(payload.changes[0]);
      getSharedWMGoal(payload.changes[0]).then((goal: GoalItem) => {
        if (goal.parentGoalId !== "root") {
          getSharedWMGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
            const parentGoalSublist = parentGoal.sublist;
            const childGoalIndex = parentGoalSublist.indexOf(goal.id);
            if (childGoalIndex !== -1) { parentGoalSublist.splice(childGoalIndex, 1); }
            await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
          });
        }
      });
    } else if (payload.typeOfChanges === "archivedGoals") {
      getSharedWMGoal(payload.changes[0]).then((goal: GoalItem) => archiveSharedWMGoal(goal));
    }
  }
};
