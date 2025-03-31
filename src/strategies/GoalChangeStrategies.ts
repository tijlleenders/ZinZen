/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { acceptSelectedSubgoals, acceptSelectedTags } from "@src/helpers/InboxProcessor";
import { sendNewGoals } from "@src/helpers/BatchPublisher";
import { sendUpdatedGoal, sendFinalUpdateOnGoal } from "@src/controllers/PubSubController";
import { removeGoalWithChildrens, archiveUserGoal, getGoal } from "@src/api/GoalsAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { GoalItem } from "@src/models/GoalItem";
import { ChangeAcceptParams, ChangeAcceptStrategy } from "@src/Interfaces/ChangeAccept";

// export class MovedStrategy implements ChangeAcceptStrategy {
//   async execute({ goalUnderReview, participants, activePPT }: ChangeAcceptParams) {
//     if (!goalUnderReview) {
//       console.log("No goal under review.");
//       return;
//     }
//     const localGoal = await getGoal(goalUnderReview.id);
//     const isNewParentAvailable = await getGoalById(goalUnderReview.parentGoalId);

//     const localParentGoalId = localGoal?.parentGoalId ?? "root";

//     const ancestors = await getGoalHistoryToRoot(goalUnderReview.id);
//     const ancestorGoalIds = ancestors.map((ele) => ele.goalID);

//     const goalsHistoryOfNewParent = await getGoalHistoryToRoot(goalUnderReview.parentGoalId);
//     const ancestorGoalIdsOfNewParent = goalsHistoryOfNewParent.map((ele) => ele.goalID);

//     const ancestorGoalsOfNewParent = await Promise.all(ancestorGoalIdsOfNewParent.map((id) => getGoal(id)));

//     const allParticipants = new Map<string, IParticipant>();

//     [...ancestorGoalsOfNewParent, isNewParentAvailable].forEach((goal) => {
//       if (!goal?.participants) return;
//       goal.participants.forEach((participant) => {
//         if (participant.following) {
//           allParticipants.set(participant.relId, participant);
//         }
//       });
//     });

//     localGoal?.participants.forEach((participant) => {
//       if (participant.following) {
//         allParticipants.set(participant.relId, participant);
//       }
//     });

//     const updatedGoal = {
//       ...localGoal,
//       participants: Array.from(allParticipants.values()),
//     };
//     const subscribers = await getParticipantsOfGoals(ancestorGoalIds);

//     const filteredSubscribers = subscribers.filter(
//       ({ sub }) => sub.following && sub.relId !== participants[activePPT].relId,
//     );

//     console.log("subscribers", activePPT);

//     try {
//       await Promise.all(
//         filteredSubscribers.map(async ({ sub }) => {
//           const rootGoal = await findParticipantTopLevelGoal(goalUnderReview.id, sub.relId);
//           sendUpdatesToSubscriber(sub, rootGoal?.id || goalUnderReview.id, "moved", [
//             {
//               level: ancestorGoalIds.length,
//               goal: {
//                 ...updatedGoal,
//                 parentGoalId: isNewParentAvailable ? goalUnderReview.parentGoalId : "root",
//               },
//             },
//           ]);
//         }),
//       );
//     } catch (error) {
//       console.error("[moveGoalHierarchy] Error sending move updates:", error);
//     }

//     await Promise.all([
//       updateGoal(goalUnderReview.id, {
//         parentGoalId: isNewParentAvailable ? goalUnderReview.parentGoalId : "root",
//         rootGoalId: isNewParentAvailable ? goalUnderReview.parentGoalId : goalUnderReview.id,
//       }),
//       removeGoalFromParentSublist(goalUnderReview.id, localParentGoalId),
//       isNewParentAvailable &&
//         addGoalToNewParentSublist(goalUnderReview.id, isNewParentAvailable ? goalUnderReview.parentGoalId : "root"),
//       updateRootGoal(goalUnderReview.id, isNewParentAvailable ? goalUnderReview.parentGoalId : goalUnderReview.id),
//     ]);
//   }
// }

export class SubgoalsStrategy implements ChangeAcceptStrategy {
  async execute({ goalUnderReview, newGoals, unselectedChanges, participants, activePPT }: ChangeAcceptParams) {
    if (!newGoals) return;
    const goalsToBeSelected: GoalItem[] = newGoals
      .filter(({ goal }) => !unselectedChanges?.includes(goal.id))
      .map(({ goal }) => goal);

    await acceptSelectedSubgoals(goalsToBeSelected, goalUnderReview);

    if (goalsToBeSelected.length > 0) {
      const { intent } = newGoals[0];

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
