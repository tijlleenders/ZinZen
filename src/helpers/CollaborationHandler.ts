import { addDeleteChanges, addEditChanges, addGoalChanges, deleteChanges } from "@src/api/OutboxAPI";

export const handleIncomingChanges = async (payload: object) => {
  const { changes, goalId, relId } = payload;
  if (changes.type === "goalAdded") {
    const { subgoals } = changes;
    await addGoalChanges({
      relId,
      goalId,
      subgoals,
      updatedGoals: [],
      deletedGoals: [],
    }
    );
  } else if (changes.type === "goalDeleted") {
    const { deletedGoals } = changes;
    await addDeleteChanges(
      {
        relId,
        goalId,
        deletedGoals,
        updatedGoals: [],
        subgoals: [],
      }
    );
  } else if (changes.type === "goalEdited") {
    const { updatedGoals } = changes;
    await addEditChanges(
      {
        relId,
        goalId,
        updatedGoals,
        deletedGoals: [],
        subgoals: [],
      }
    );
  } else if (changes.type === "goalCompleted") {

  }
};
