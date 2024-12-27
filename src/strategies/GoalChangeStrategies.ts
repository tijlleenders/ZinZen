/* eslint-disable max-classes-per-file */
import { acceptSelectedSubgoals, acceptSelectedTags } from "@src/helpers/InboxProcessor";
import { sendNewGoals } from "@src/helpers/BatchPublisher";
import { sendUpdatedGoal, sendFinalUpdateOnGoal } from "@src/controllers/PubSubController";
import { removeGoalWithChildrens, archiveUserGoal, updateGoal, getGoalById, getGoal } from "@src/api/GoalsAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import {
  addGoalToNewParentSublist,
  removeGoalFromParentSublist,
  updateRootGoal,
} from "@src/controllers/GoalController";
import { GoalItem } from "@src/models/GoalItem";
import { ChangeAcceptStrategy } from "@src/Interfaces/ChangeAccept";

export class MovedStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: any) {
    if (!goalUnderReview) {
      console.log("No goal under review.");
      return;
    }
    const localGoal = await getGoal(goalUnderReview.id);
    const localParentGoalId = localGoal?.parentGoalId ?? "root";

    const isNewParentAvailable = await getGoalById(goalUnderReview.parentGoalId);

    await Promise.all([
      updateGoal(goalUnderReview.id, { parentGoalId: isNewParentAvailable ? goalUnderReview.parentGoalId : "root" }),
      removeGoalFromParentSublist(goalUnderReview.id, localParentGoalId),
      isNewParentAvailable &&
        addGoalToNewParentSublist(goalUnderReview.id, isNewParentAvailable ? goalUnderReview.parentGoalId : "root"),
      updateRootGoal(goalUnderReview.id, isNewParentAvailable ? goalUnderReview.parentGoalId : "root"),
    ]);

    await sendUpdatedGoal(
      goalUnderReview.id,
      [],
      true,
      updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
      "moved",
    );
  }
}

export class SubgoalsStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, newGoals, unselectedChanges, participants, activePPT }: any) {
    const goalsToBeSelected: GoalItem[] = newGoals
      .filter(({ goal }) => !unselectedChanges.includes(goal.id))
      .map(({ goal }) => goal);

    await acceptSelectedSubgoals(goalsToBeSelected, goalUnderReview);

    if (goalsToBeSelected.length > 0) {
      const { intent } = newGoals[0];
      await sendNewGoals(goalsToBeSelected, [], intent === "suggestion" ? [] : [participants[activePPT].relId]);
    }
  }
}

export class ModifiedGoalsStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, unselectedChanges, updateList, updatesIntent, participants, activePPT }: any) {
    await acceptSelectedTags(unselectedChanges, updateList, goalUnderReview);
    await sendUpdatedGoal(
      goalUnderReview.id,
      [],
      true,
      updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
    );
  }
}

export class DeletedStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: any) {
    await sendFinalUpdateOnGoal(
      goalUnderReview.id,
      "deleted",
      [],
      true,
      updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
    );
    await removeGoalWithChildrens(goalUnderReview);
  }
}

export class ArchivedStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: any) {
    await archiveUserGoal(goalUnderReview);
    sendFinalUpdateOnGoal(
      goalUnderReview.id,
      "archived",
      [],
      true,
      updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
    );
  }
}

export class RestoredStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: any) {
    await restoreUserGoal(goalUnderReview);
    sendFinalUpdateOnGoal(
      goalUnderReview.id,
      "restored",
      [],
      true,
      updatesIntent === "suggestion" ? [] : [participants[activePPT].relId],
    );
  }
}
