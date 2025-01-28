/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import {
  addGoalsInSharedWM,
  addSharedWMSublist,
  archiveSharedWMGoal,
  getSharedWMGoal,
  removeSharedWMChildrenGoals,
  removeSharedWMGoal,
  removeSharedWMGoalFromParentSublist,
  updateSharedWMGoal,
} from "@src/api/SharedWMAPI";
import { changesInGoal, changesInId, Payload } from "@src/models/InboxItem";
import { fixDateVlauesInGoalObject } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import { getDeletedGoal, restoreUserGoal } from "@src/api/TrashAPI";
import { getAllDescendants, updateRootGoal } from "@src/controllers/GoalController";
import { ChangeStrategy } from "./ChangeStrategy";

export class SubgoalsStrategy implements ChangeStrategy {
  async execute(payload: Payload, relId: string): Promise<void> {
    const changes = payload.changes.map((ele: changesInGoal) => ({
      ...ele,
      goal: fixDateVlauesInGoalObject(ele.goal),
    }));

    await Promise.all(
      changes.map(async (ele) => {
        await addGoalsInSharedWM([ele.goal], relId);
      }),
    );
  }
}

export class ModifiedGoalsStrategy implements ChangeStrategy {
  async execute(payload: Payload): Promise<void> {
    const changes = payload.changes.map((ele: changesInGoal) => ({
      ...ele,
      goal: fixDateVlauesInGoalObject(ele.goal),
    }));
    await updateSharedWMGoal(changes[0].goal.id, changes[0].goal);
  }
}

export class DeletedStrategy implements ChangeStrategy {
  async execute(payload: Payload): Promise<void> {
    const change = payload.changes[0] as changesInId;
    const goalToBeDeleted = await getSharedWMGoal(change.id);
    if (!goalToBeDeleted) {
      console.error("[DeletedStrategy] Goal to be deleted not found", { goalId: change.id });
      return;
    }
    await removeSharedWMChildrenGoals(goalToBeDeleted.id);
    await removeSharedWMGoal(goalToBeDeleted);

    if (goalToBeDeleted.parentGoalId !== "root") {
      const parentGoal = await getSharedWMGoal(goalToBeDeleted.parentGoalId);
      if (!parentGoal) {
        console.error("[DeletedStrategy] Parent goal not found", { goalId: goalToBeDeleted.parentGoalId });
        return;
      }
      const parentGoalSublist = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goalToBeDeleted.id);
      if (childGoalIndex !== -1) {
        parentGoalSublist.splice(childGoalIndex, 1);
      }
      await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
    }
  }
}

export class ArchivedStrategy implements ChangeStrategy {
  async execute(payload: Payload): Promise<void> {
    const change = payload.changes[0] as changesInId;
    getSharedWMGoal(change.id).then(async (goal: GoalItem) =>
      archiveSharedWMGoal(goal).catch((err) => console.log(err, "failed to archive")),
    );
  }
}

export class RestoredStrategy implements ChangeStrategy {
  async execute(payload: Payload): Promise<void> {
    const change = payload.changes[0] as changesInId;
    const goalToBeRestored = await getDeletedGoal(change.id);
    if (goalToBeRestored) {
      await restoreUserGoal(goalToBeRestored, true);
    }
  }
}

// const updateSharedWMGoalAndDescendants = async (movedGoal: GoalItem) => {
//   await updateSharedWMGoal(movedGoal.id, {
//     parentGoalId: movedGoal.parentGoalId,
//     rootGoalId: movedGoal.rootGoalId,
//   });

//   const descendants = await getAllDescendants(movedGoal.id);
//   if (descendants.length > 0) {
//     await Promise.all(
//       descendants.map((descendant) =>
//         updateSharedWMGoal(descendant.id, {
//           rootGoalId: movedGoal.rootGoalId,
//         }),
//       ),
//     );
//   }
// };

const handleMoveOperation = async (goalToMoveId: string, newParentGoalId: string) => {
  const goalToMove = await getSharedWMGoal(goalToMoveId);
  if (!goalToMove) {
    console.error("[MovedStrategy] Goal to move not found", { goalId: goalToMoveId });
    return;
  }
  const newParentGoal = await getSharedWMGoal(newParentGoalId);
  const updatedGoal = {
    ...goalToMove,
    rootGoalId: !newParentGoal ? "root" : newParentGoalId,
  };

  await Promise.all([
    updateSharedWMGoal(goalToMove.id, {
      parentGoalId: newParentGoalId,
      participants: updatedGoal.participants,
    }),
    removeSharedWMGoalFromParentSublist(goalToMove.id, goalToMove.parentGoalId),
    addSharedWMSublist(newParentGoalId, [goalToMove.id]),
    updateRootGoal(goalToMove.id, newParentGoal?.rootGoalId ?? "root"),
  ]);
  // update participants in descendants
  const descendants = await getAllDescendants(goalToMove.id);
  if (descendants.length > 0) {
    await Promise.all(
      descendants.map((descendant) =>
        updateSharedWMGoal(descendant.id, {
          rootGoalId: newParentGoal?.rootGoalId || "root",
        }),
      ),
    );
  }
};

export class MovedStrategy implements ChangeStrategy {
  async execute(payload: Payload): Promise<void> {
    const changes = payload.changes.map((ele: changesInGoal) => ({
      ...ele,
      goal: fixDateVlauesInGoalObject(ele.goal),
    }));

    const movedGoal = changes[0].goal;
    const correspondingSharedWMGoal = await getSharedWMGoal(movedGoal.id);

    if (!correspondingSharedWMGoal) {
      console.error("[MovedStrategy] Goal to move not found", { goalId: movedGoal.id });
      return;
    }

    await handleMoveOperation(movedGoal.id, movedGoal.parentGoalId);
  }
}
