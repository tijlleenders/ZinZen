import { addChangesInGoal } from "@src/api/OutboxAPI";

export const handleIncomingChanges = async (payload) => {
  const { changes, goalId, relId } = payload;
  const defaultParams = {
    relId,
    goalId,
    subgoals: [],
    updates: [],
    deleted: false,
    completed: false,
  };
  if (changes.type === "goalAdded") {
    const { subgoals } = changes;
    await addChangesInGoal({ ...defaultParams, subgoals }, "subgoals");
  } else if (changes.type === "goalDeleted") {
    await addChangesInGoal({ ...defaultParams, deleted: true }, "deleted");
  } else if (changes.type === "goalEdited") {
    const { updates } = changes;
    await addChangesInGoal({ ...defaultParams, updates }, "updates");
  } else if (changes.type === "goalCompleted") {
    await addChangesInGoal({ ...defaultParams, completed: true }, "completed");
  }
};
