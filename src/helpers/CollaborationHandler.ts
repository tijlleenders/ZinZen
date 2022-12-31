import { addGoalChanges } from "@src/api/OutboxAPI";

export const handleIncomingChanges = async (payload: object) => {
  const { changes, goalId, relId } = payload;
  if (changes.type === "goalAdded") {
    const { subgoals } = changes;
    await addGoalChanges(goalId, {
      relId,
      goalId,
      subgoals,
      updatedGoals: [],
      deletedGoals: [],
    }
    );
  } else if (changes.type === "goalDeleted") {

  } else if (changes.type === "goalEdited") {

  } else if (changes.type === "goalCompleted") {

  }
};
