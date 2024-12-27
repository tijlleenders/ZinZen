/* eslint-disable max-classes-per-file */
import {
  addGoalsInSharedWM,
  archiveSharedWMGoal,
  getSharedWMGoal,
  removeSharedWMChildrenGoals,
  removeSharedWMGoal,
  updateSharedWMGoal,
  updateSharedWMParentSublist,
} from "@src/api/SharedWMAPI";
import { changesInGoal, changesInId } from "@src/models/InboxItem";
import { fixDateVlauesInGoalObject } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import { getDeletedGoal } from "@src/api/TrashAPI";
import { getAllDescendants } from "@src/controllers/GoalController";
import { ChangeStrategy } from "./ChangeStrategy";
import { Payload } from "../InboxProcessor";

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
  async execute(payload: Payload, relId: string): Promise<void> {
    const changes = payload.changes.map((ele: changesInGoal) => ({
      ...ele,
      goal: fixDateVlauesInGoalObject(ele.goal),
    }));
    await updateSharedWMGoal(changes[0].goal.id, changes[0].goal);
  }
}

export class DeletedStrategy implements ChangeStrategy {
  async execute(payload: Payload, relId: string): Promise<void> {
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
  async execute(payload: Payload, relId: string): Promise<void> {
    const change = payload.changes[0] as changesInId;
    getSharedWMGoal(change.id).then(async (goal: GoalItem) =>
      archiveSharedWMGoal(goal).catch((err) => console.log(err, "failed to archive")),
    );
  }
}

export class RestoredStrategy implements ChangeStrategy {
  async execute(payload: Payload, relId: string): Promise<void> {
    const change = payload.changes[0] as changesInId;
    const goalToBeRestored = await getDeletedGoal(change.id);
    if (goalToBeRestored) {
      await restoreUserGoal(goalToBeRestored, true);
    }
  }
}

const updateSharedWMGoalAndDescendants = async (movedGoal: GoalItem) => {
  await updateSharedWMGoal(movedGoal.id, {
    parentGoalId: movedGoal.parentGoalId,
    rootGoalId: movedGoal.rootGoalId,
  });

  const descendants = await getAllDescendants(movedGoal.id);
  if (descendants.length > 0) {
    await Promise.all(
      descendants.map((descendant) =>
        updateSharedWMGoal(descendant.id, {
          rootGoalId: movedGoal.rootGoalId,
        }),
      ),
    );
  }
};

const handleMoveOperation = async (movedGoal: GoalItem, correspondingSharedWMGoal: GoalItem) => {
  const isNewParentAvailable = await getSharedWMGoal(movedGoal.parentGoalId);
  const updatedGoal = {
    ...movedGoal,
    parentGoalId: !isNewParentAvailable ? "root" : movedGoal.parentGoalId,
    rootGoalId: !isNewParentAvailable ? "root" : movedGoal.rootGoalId,
  };

  await updateSharedWMParentSublist(
    correspondingSharedWMGoal.parentGoalId,
    updatedGoal.parentGoalId,
    correspondingSharedWMGoal.id,
  );
  await updateSharedWMGoalAndDescendants(updatedGoal);
};

export class MovedStrategy implements ChangeStrategy {
  async execute(payload: Payload, relId: string): Promise<void> {
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

    await handleMoveOperation(movedGoal, correspondingSharedWMGoal);
  }
}
