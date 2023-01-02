import { addCompleteChanges, addDeleteChanges, addEditChanges, addGoalChanges, deleteChanges } from "@src/api/OutboxAPI";

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
      completedGoals: []
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
        completedGoals: []
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
        completedGoals: []
      }
    );
  } else if (changes.type === "goalCompleted") {
    const { completedGoals } = changes;
    await addCompleteChanges(
      {
        relId,
        goalId,
        completedGoals,
        updatedGoals: [],
        deletedGoals: [],
        subgoals: [],
      }
    );
  }
};
