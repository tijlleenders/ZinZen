import { addChangesInGoal } from "@src/api/OutboxAPI";

export const handleIncomingChanges = async (payload) => {
  const { changes, goalId, relId } = payload;
  const defaultParams = {
    relId,
    goalId,
    subgoals: [],
    updatedGoals: [],
    deletedGoals: [],
    completedGoals: []
  };
  if (changes.type === "goalAdded") {
    const { subgoals } = changes;
    await addChangesInGoal({ ...defaultParams, subgoals }, "subgoals");
  } else if (changes.type === "goalDeleted") {
    const { deletedGoals } = changes;
    await addChangesInGoal({ ...defaultParams, deletedGoals }, "deletedGoals");
  } else if (changes.type === "goalEdited") {
    const { updatedGoals } = changes;
    await addChangesInGoal({ ...defaultParams, updatedGoals }, "updatedGoals");
  } else if (changes.type === "goalCompleted") {
    const { completedGoals } = changes;
    await addChangesInGoal({ ...defaultParams, completedGoals }, "completedGoals");
  }
};
