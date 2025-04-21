/* eslint-disable complexity */
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import {
  ChangesByType,
  changesInGoal,
  changesInId,
  IdChangeTypes,
  Payload,
  typeOfChange,
  typeOfIntent,
} from "@src/models/InboxItem";

import { getDefaultValueOfGoalChanges } from "@src/utils/defaultGenerators";
import {
  addGoal,
  addIntoSublist,
  // changeNewUpdatesStatus,
  getGoal,
  updateGoal,
} from "@src/api/GoalsAPI";
import { addGoalChangesInID, createEmptyInboxItem, getInboxItem, removeGoalInbox } from "@src/api/InboxAPI";
import { getSharedWMGoal } from "@src/api/SharedWMAPI";
import { ITagChangesSchemaVersion, ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { fixDateVlauesInGoalObject } from "@src/utils";
import {
  addGoalToNewParentSublist,
  getGoalAncestors,
  getNotificationGoalId,
  inheritParticipants,
  removeGoalFromParentSublist,
  updateRootGoalNotification,
} from "@src/controllers/GoalController";
import { SharedGoalChangesManager } from "./strategies/SharedGoalChangesManager";
import {
  ArchivedStrategy,
  DeletedStrategy,
  ModifiedGoalsStrategy,
  RestoredStrategy,
  SubgoalsStrategy,
} from "./strategies/SharedGoalChangeStrategies";

const checkThisTagsIfTheyAreChanged = [
  "title",
  "duration",
  "on",
  "due",
  "start",
  "beforeTime",
  "afterTime",
  "parentGoalId",
  "goalColor",
  "timeBudget",
] as const;

function checkIfTagsAreChanged(goal: GoalItem, changes: GoalItem): boolean {
  return checkThisTagsIfTheyAreChanged.some((tag) => {
    const goalValue = goal[tag as keyof GoalItem];
    const changesValue = changes[tag as keyof GoalItem];

    let areDifferent = false;
    if (tag === "timeBudget") {
      // Directly compare known properties of timeBudget
      const goalBudget = goalValue as GoalItem["timeBudget"];
      const changesBudget = changesValue as GoalItem["timeBudget"];

      if (goalBudget && changesBudget) {
        areDifferent = goalBudget.perDay !== changesBudget.perDay || goalBudget.perWeek !== changesBudget.perWeek;
      } else {
        areDifferent = goalBudget !== changesBudget;
      }
    } else if (Array.isArray(goalValue) && Array.isArray(changesValue)) {
      areDifferent = JSON.stringify(goalValue) !== JSON.stringify(changesValue);
    } else {
      areDifferent = goalValue !== changesValue;
    }

    if (areDifferent) {
      console.log(`Tag changed: ${tag}, Goal value:`, goalValue, "Changes value:", changesValue);
    }

    return areDifferent;
  });
}

export async function isIncomingIdChangeLatest(
  localGoalTimestamp: number,
  incomingChangeTimestamp: number,
): Promise<boolean> {
  if (incomingChangeTimestamp > localGoalTimestamp) {
    return true;
  }

  return false;
}

const isIdChangeType = (type: typeOfChange): type is IdChangeTypes => {
  return ["deleted", "moved", "restored", "archived"].includes(type);
};

const addChangesToRootGoal = async (relId: string, changes: ChangesByType, notificationGoalId: string) => {
  const inbox = await getInboxItem(notificationGoalId);
  if (!inbox) {
    await createEmptyInboxItem(notificationGoalId);
  }

  try {
    await Promise.all([
      updateRootGoalNotification(notificationGoalId),
      addGoalChangesInID(notificationGoalId, relId, changes),
    ]);
  } catch (error) {
    console.error("[addChangesToRootGoal] Error adding changes:", {
      notificationGoalId,
      error,
    });
  }
};

const handleSubgoalsChanges = async (
  changes: changesInGoal[],
  changeType: typeOfChange,
  relId: string,
  type: string,
) => {
  const goalsWithParticipants = changes.map((ele: changesInGoal) => ({
    ...ele,
    goal: {
      ...fixDateVlauesInGoalObject(ele.goal),
    },
  }));

  const incomingNewGoalsParent = await getGoal(changes[0].goal.parentGoalId);

  if (!incomingNewGoalsParent) {
    console.log("Incoming new goals parent not found", changes[0].goal.parentGoalId);
    return;
  }

  const notificationGoalId = await getNotificationGoalId(incomingNewGoalsParent.id);

  if (!notificationGoalId) {
    console.log("Notification goal id not found", incomingNewGoalsParent.id);
    return;
  }

  const defaultChanges = getDefaultValueOfGoalChanges();
  (defaultChanges[changeType] as changesInGoal[]) = goalsWithParticipants.map((ele) => ({
    ...ele,
    intent: type as typeOfIntent,
  }));
  await addChangesToRootGoal(relId, defaultChanges, notificationGoalId);
};

const createDefaultChangesWithIntent = (
  changes: (changesInGoal | changesInId)[],
  changeType: typeOfChange,
  intentType: typeOfIntent,
) => {
  const defaultChanges = getDefaultValueOfGoalChanges();
  if (isIdChangeType(changeType)) {
    defaultChanges[changeType] = changes.map((ele) => ({
      ...(ele as changesInId),
      intent: intentType,
    }));
  } else {
    defaultChanges[changeType] = changes.map((ele) => ({
      ...(ele as changesInGoal),
      intent: intentType,
    }));
  }
  return defaultChanges;
};

export const handleIncomingChanges = async (payload: Payload, relId: string) => {
  console.log("Incoming change", payload);

  const incGoal = await getSharedWMGoal(payload.notificationGoalId);
  console.log("incGoal", incGoal);

  // handle partner goal changes
  if (payload.type === "sharer" && incGoal) {
    console.log("Incoming change is a shared goal. Processing...");

    if (!incGoal) {
      console.log("Changes ignored");
      return;
    }

    const sharedGoalManager = new SharedGoalChangesManager();

    switch (payload.changeType) {
      case "subgoals":
        sharedGoalManager.setStrategy(new SubgoalsStrategy());
        break;
      case "modifiedGoals":
        sharedGoalManager.setStrategy(new ModifiedGoalsStrategy());
        break;
      case "deleted":
        sharedGoalManager.setStrategy(new DeletedStrategy());
        break;
      case "archived":
        sharedGoalManager.setStrategy(new ArchivedStrategy());
        break;
      case "restored":
        sharedGoalManager.setStrategy(new RestoredStrategy());
        break;
      default:
        console.warn(`Unhandled change type: ${payload.changeType}`);
        break;
    }

    await sharedGoalManager.execute(payload, relId);
  }

  // handle collaborator goal changes
  else if (["sharer", "suggestion"].includes(payload.type)) {
    const { changes, changeType, timestamp } = payload;

    // handle new goals
    if (changeType === "subgoals") {
      await handleSubgoalsChanges(changes as changesInGoal[], changeType, relId, payload.type);
      return;
    }

    // get local goal version of the incoming changes
    const goalId = "goal" in changes[0] ? changes[0].goal.id : changes[0].id;
    const localGoal = await getGoal(goalId);

    // ignore the changes if incoming changed tags are the same as local goal
    if (changeType === "modifiedGoals") {
      if ("goal" in changes[0]) {
        const currentGoal = await getGoal(changes[0].goal.id);
        if (currentGoal) {
          const hasChanges = checkIfTagsAreChanged(currentGoal, changes[0].goal);
          if (!hasChanges) {
            console.log("Ignoring change - tags are the same");
            return;
          }
        }
      }

      // handle the case where goal is not found in local db
      // maybe already moved to other place or not yet added to local db
      if (!localGoal) {
        console.log("Goal not found in local db. processing changes...");
        const defaultChanges = createDefaultChangesWithIntent(changes, changeType, payload.type as typeOfIntent);

        const notificationGoalId = await getNotificationGoalId(goalId);

        await addChangesToRootGoal(relId, defaultChanges, notificationGoalId || goalId);
        return;
      }

      // check if all changes are latest for LWW
      const allAreLatest = await Promise.all(
        changes.map(async (ele) => {
          const isLatest = await isIncomingIdChangeLatest(localGoal?.timestamp || 0, timestamp);

          return isLatest ? ele : null;
        }),
      );

      const filteredChanges = allAreLatest.filter((ele) => ele !== null);

      if (filteredChanges.length === 0) {
        console.log("All changes are not latest");
        return;
      }

      const defaultChanges = createDefaultChangesWithIntent(filteredChanges, changeType, payload.type as typeOfIntent);

      const notificationGoalId = await getNotificationGoalId(goalId);

      if (!notificationGoalId) {
        console.log("Notification goal id not found", goalId);
        return;
      }

      await addChangesToRootGoal(relId, defaultChanges, notificationGoalId);
    }
  }
};

export const acceptSelectedSubgoals = async (selectedGoals: GoalItem[], parentGoal: GoalItem) => {
  try {
    const childrens: string[] = [];
    const newParentAncestors = await getGoalAncestors(parentGoal.id);

    // Get all ancestor goals to collect their participants
    const ancestorGoals = await Promise.all(newParentAncestors.map((id) => getGoal(id)));
    const allParticipants = new Map<string, IParticipant>();

    [...ancestorGoals, parentGoal].forEach((goal) => {
      if (!goal?.participants) return;
      goal.participants.forEach((participant) => {
        if (participant.following) {
          allParticipants.set(participant.relId, participant);
        }
      });
    });

    await Promise.all(
      selectedGoals.map(async (goal: GoalItem) => {
        const participants = await inheritParticipants(parentGoal);

        await addGoal(
          fixDateVlauesInGoalObject({
            ...goal,
            participants,
            notificationGoalId: parentGoal.notificationGoalId,
          }),
        );
        childrens.push(goal.id);
      }),
    );

    await addIntoSublist(parentGoal.id, childrens);
    return "Done!!";
  } catch (err) {
    console.error("[acceptSelectedSubgoals] Failed to add changes:", err);
    return "Failed To add Changes";
  }
};

export const acceptSelectedTags = async (unselectedTags: string[], updateList: ITagsChanges, goal: GoalItem) => {
  const { schemaVersion, prettierVersion } = updateList;
  const finalChanges: ITagChangesSchemaVersion = {};

  // handle move change first
  if ("parentGoalId" in schemaVersion && !unselectedTags.includes("parentGoalId")) {
    const newParentGoalId = schemaVersion.parentGoalId as string;
    const newParentGoal = await getGoal(newParentGoalId);

    if (!newParentGoal) {
      // handle the case where the new parent goal is not found
      // so if new parent goal is not found, then we need to move the goal to the root goal
      finalChanges.parentGoalId = "root";
      finalChanges.notificationGoalId = goal.id;
    }

    // update goal relationships
    await Promise.all([
      removeGoalFromParentSublist(goal.id, goal.parentGoalId),
      addGoalToNewParentSublist(goal.id, newParentGoalId),
    ]);

    finalChanges.parentGoalId = newParentGoalId;
  }

  Object.keys(prettierVersion).forEach((ele) => {
    if (!unselectedTags.includes(ele)) {
      if (ele === "timing") {
        if ("afterTime" in schemaVersion) {
          finalChanges.afterTime = schemaVersion.afterTime;
        }
        if ("beforeTime" in schemaVersion) {
          finalChanges.beforeTime = schemaVersion.beforeTime;
        }
      } else if (ele !== "parentGoalId") {
        finalChanges[ele] = schemaVersion[ele];
      }
    }
  });

  await updateGoal(goal.id, {
    ...finalChanges,
    newUpdates: false,
    start:
      finalChanges.start && typeof finalChanges.start === "string" ? new Date(finalChanges.start).toISOString() : null,
    due: finalChanges.due && typeof finalChanges.due === "string" ? new Date(finalChanges.due).toISOString() : null,
  });
};

export const checkAndUpdateGoalNewUpdatesStatus = async (goalId: string) => {
  try {
    const inbox = await getInboxItem(goalId);
    const goal = await getGoal(goalId);

    const doesItContainsSubgoalChanges = Object.keys(inbox?.changes).some((key) => {
      const changeObject = inbox.changes[key];
      return Array.isArray(changeObject.subgoals) && changeObject.subgoals.length > 0;
    });

    // if the goal is not found, then remove the inbox
    if (!goal && !doesItContainsSubgoalChanges) {
      await removeGoalInbox(goalId);
      return;
    }
    const notificationGoalId = await getNotificationGoalId(goalId);

    if (!notificationGoalId) {
      console.log("Notification goal id not found", goalId);
      return;
    }

    // alter the inbox of the goal to be the inbox of the root goal
    if (goal?.parentGoalId !== "root" && inbox && Object.keys(inbox.changes).length > 0) {
      const notificationInbox = await getInboxItem(notificationGoalId);
      console.log("notificationInbox", notificationInbox);
      if (!notificationInbox) {
        await createEmptyInboxItem(notificationGoalId);
      }

      await Promise.all(
        Object.entries(inbox.changes).map(([relId, changes]) => addGoalChangesInID(notificationGoalId, relId, changes)),
      );

      await removeGoalInbox(goalId);
    }

    // if the root goal has changes, then update the goal newUpdates status
    const notificationInbox = await getInboxItem(notificationGoalId);
    if (notificationInbox && Object.keys(notificationInbox.changes).length > 0) {
      const notificationGoal = await getGoal(notificationGoalId);
      if (notificationGoal && !notificationGoal.newUpdates) {
        await updateGoal(notificationGoalId, { newUpdates: true });
      }
    } else {
      const rootGoal = await getGoal(notificationGoalId);
      if (rootGoal?.newUpdates) {
        await updateGoal(notificationGoalId, { newUpdates: false });
      }
    }
  } catch (error) {
    console.error("[checkAndUpdateGoalNewUpdatesStatus] Error checking inbox:", error);
  }
};
