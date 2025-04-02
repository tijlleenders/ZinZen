/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { acceptSelectedSubgoals, acceptSelectedTags } from "@src/helpers/InboxProcessor";
import { sendNewGoals } from "@src/helpers/BatchPublisher";
import { sendUpdatedGoal, sendFinalUpdateOnGoal } from "@src/controllers/PubSubController";
import { removeGoalWithChildrens, archiveUserGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { GoalItem } from "@src/models/GoalItem";
import { ChangeAcceptParams, ChangeAcceptStrategy } from "@src/Interfaces/ChangeAccept";
import { createEmptyInboxItem, getInboxItem, removeGoalInbox, addGoalChangesInID } from "@src/api/InboxAPI";
import { getNotificationGoalId } from "@src/controllers/GoalController";

export class SubgoalsStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, newGoals, unselectedChanges, participants, activePPT }: ChangeAcceptParams) {
    if (!newGoals) return;
    const goalsToBeSelected: GoalItem[] = newGoals
      .filter(({ goal }) => !unselectedChanges?.includes(goal.id))
      .map(({ goal }) => goal);

    await acceptSelectedSubgoals(goalsToBeSelected, goalUnderReview);

    if (goalsToBeSelected.length > 0) {
      const { intent } = newGoals[0];

      goalsToBeSelected.forEach(async (goal) => {
        const inboxItem = await getInboxItem(goal.id);
        if (inboxItem) {
          const newIdForInbox = await getNotificationGoalId(goal.id);
          if (newIdForInbox) {
            await createEmptyInboxItem(newIdForInbox);
            await addGoalChangesInID(
              newIdForInbox,
              Object.keys(inboxItem.changes)[0],
              inboxItem.changes[Object.keys(inboxItem.changes)[0]],
            );
            await removeGoalInbox(goal.id);
            await updateGoal(newIdForInbox, { newUpdates: true });
          }
        }
      });

      const newlyCreatedGoals = await Promise.all(
        goalsToBeSelected.map(async (goal) => {
          const localGoal = await getGoal(goal.id);
          if (!localGoal) {
            return null;
          }
          return localGoal;
        }),
      );
      const validGoals = newlyCreatedGoals.filter((goal): goal is GoalItem => goal !== null);

      await sendNewGoals(validGoals, [], intent === "suggestion" ? [] : [participants[activePPT].relId]);
    }
  }
}

export class ModifiedGoalsStrategy implements ChangeAcceptStrategy {
  async execute({
    goalUnderReview,
    unselectedChanges,
    updateList,
    updatesIntent,
    participants,
    activePPT,
  }: ChangeAcceptParams) {
    if (!unselectedChanges || !updateList) return;
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
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: ChangeAcceptParams) {
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
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: ChangeAcceptParams) {
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
  async execute({ goalUnderReview, updatesIntent, participants, activePPT }: ChangeAcceptParams) {
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
