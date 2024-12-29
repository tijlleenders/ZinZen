import { GoalItem, IParticipant } from "@src/models/GoalItem";
import {
  ChangesByType,
  changesInGoal,
  changesInId,
  IdChangeTypes,
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
  getGoalAncestors,
  getRootGoalId,
  inheritParticipants,
  updateRootGoalNotification,
} from "@src/controllers/GoalController";
import { isIncomingGoalLatest, isIncomingIdChangeLatest } from "./mergeSharedGoalItems";
import { SharedGoalChangesManager } from "./strategies/SharedGoalChangesManager";
import {
  ArchivedStrategy,
  DeletedStrategy,
  ModifiedGoalsStrategy,
  MovedStrategy,
  RestoredStrategy,
  SubgoalsStrategy,
} from "./strategies/SharedGoalChangeStrategies";

export interface Payload {
  relId: string;
  lastProcessedTimestamp: string;
  changeType: typeOfChange;
  rootGoalId: string;
  changes: (changesInGoal | changesInId)[];
  type: string;
  timestamp: string;
  TTL: number;
}

const isIdChangeType = (type: typeOfChange): type is IdChangeTypes => {
  return ["deleted", "moved", "restored", "archived"].includes(type);
};

const addChangesToRootGoal = async (relId: string, changes: ChangesByType, rootGoalId: string) => {
  const inbox = await getInboxItem(rootGoalId);

  if (!inbox) {
    await createEmptyInboxItem(rootGoalId);
  }

  try {
    await Promise.all([updateRootGoalNotification(rootGoalId), addGoalChangesInID(rootGoalId, relId, changes)]);
  } catch (error) {
    console.error("[addChangesToRootGoal] Error adding changes:", {
      rootGoalId,
      error,
    });
  }
};

const handleSubgoalsChanges = async (
  changes: changesInGoal[],
  changeType: typeOfChange,
  rootGoalId: string,
  relId: string,
  type: string,
) => {
  const goalsWithParticipants = changes.map((ele: changesInGoal) => ({
    ...ele,
    goal: {
      ...fixDateVlauesInGoalObject(ele.goal),
    },
  }));

  const defaultChanges = getDefaultValueOfGoalChanges();
  (defaultChanges[changeType] as changesInGoal[]) = goalsWithParticipants.map((ele) => ({
    ...ele,
    intent: type as typeOfIntent,
  }));
  await addChangesToRootGoal(relId, defaultChanges, rootGoalId);
};

export const handleIncomingChanges = async (payload: Payload, relId: string) => {
  console.log("Incoming change", payload);

  if (payload.type === "sharer" && (await getSharedWMGoal(payload.rootGoalId))) {
    console.log("Incoming change is a shared goal. Processing...");
    const incGoal = await getSharedWMGoal(payload.rootGoalId);

    if (!incGoal || incGoal.participants.find((ele) => ele.relId === relId && ele.following) === undefined) {
      console.log("Changes ignored");
      return;
    }

    const sharedGoalManager = new SharedGoalChangesManager();

    switch (payload.changeType) {
      case "subgoals":
      case "newGoalMoved":
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
      case "moved":
        sharedGoalManager.setStrategy(new MovedStrategy());
        break;
      default:
        console.warn(`Unhandled change type: ${payload.changeType}`);
        break;
    }

    await sharedGoalManager.execute(payload, relId);
  } else if (["sharer", "suggestion"].includes(payload.type)) {
    const { changes, changeType, rootGoalId } = payload;
    if (changeType === "subgoals" || changeType === "newGoalMoved") {
      await handleSubgoalsChanges(changes as changesInGoal[], changeType, rootGoalId, relId, payload.type);
      return;
    }

    const goalId = "goal" in changes[0] ? changes[0].goal.id : changes[0].id;
    const localGoal = await getGoal(goalId);

    if (!localGoal?.participants.find((p) => p.relId === relId && p.following)) {
      console.log("[InboxProcessor] Participant not following");
      return;
    }

    // handle the case where goal is already moved to other place
    if (!localGoal) {
      const defaultChanges = getDefaultValueOfGoalChanges();
      if (isIdChangeType(changeType)) {
        defaultChanges[changeType] = changes.map((ele) => ({
          ...(ele as changesInId),
          intent: payload.type as typeOfIntent,
        }));
      } else {
        defaultChanges[changeType] = changes.map((ele) => ({
          ...(ele as changesInGoal),
          intent: payload.type as typeOfIntent,
        }));
      }
      return;
    }

    const allAreLatest = await Promise.all(
      changes.map(async (ele) => {
        let isLatest = true;
        if ("goal" in ele) {
          isLatest = await isIncomingGoalLatest(localGoal.id, ele.goal);
        } else {
          isLatest = await isIncomingIdChangeLatest(localGoal.id, ele.timestamp);
        }
        return isLatest ? ele : null;
      }),
    );

    const filteredChanges = allAreLatest.filter((ele) => ele !== null);

    if (filteredChanges.length === 0) {
      console.log("All changes are not latest");
      return;
    }
    const defaultChanges = getDefaultValueOfGoalChanges();
    if (isIdChangeType(changeType)) {
      defaultChanges[changeType] = filteredChanges.map((ele) => ({
        ...(ele as changesInId),
        intent: payload.type as typeOfIntent,
      }));
    } else {
      defaultChanges[changeType] = filteredChanges.map((ele) => ({
        ...(ele as changesInGoal),
        intent: payload.type as typeOfIntent,
      }));
    }

    await addChangesToRootGoal(relId, defaultChanges, rootGoalId);
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
            rootGoalId: parentGoal.rootGoalId,
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
  Object.keys(prettierVersion).forEach((ele) => {
    if (!unselectedTags.includes(ele)) {
      if (ele === "timing") {
        if ("afterTime" in schemaVersion) {
          finalChanges.afterTime = schemaVersion.afterTime;
        }
        if ("beforeTime" in schemaVersion) {
          finalChanges.beforeTime = schemaVersion.beforeTime;
        }
      } else finalChanges[ele] = schemaVersion[ele];
    }
  });
  await updateGoal(goal.id, {
    ...finalChanges,
    newUpdates: false,
    start: finalChanges.start ? new Date(finalChanges.start) : null,
    due: finalChanges.due ? new Date(finalChanges.due) : null,
  });
};

export const checkAndUpdateGoalNewUpdatesStatus = async (goalId: string) => {
  try {
    const inbox = await getInboxItem(goalId);
    const goal = await getGoal(goalId);

    if (!goal) {
      return;
    }
    const rootGoalId = await getRootGoalId(goalId);

    if (goal.parentGoalId !== "root" && inbox && Object.keys(inbox.changes).length > 0) {
      const rootInbox = await getInboxItem(rootGoalId);
      console.log("rootInbox", rootInbox);
      if (!rootInbox) {
        await createEmptyInboxItem(rootGoalId);
      }

      await Promise.all(
        Object.entries(inbox.changes).map(([relId, changes]) => addGoalChangesInID(rootGoalId, relId, changes)),
      );

      await removeGoalInbox(goalId);
    }

    const rootInbox = await getInboxItem(rootGoalId);
    if (rootInbox && Object.keys(rootInbox.changes).length > 0) {
      const rootGoal = await getGoal(rootGoalId);
      if (rootGoal && !rootGoal.newUpdates) {
        await updateGoal(rootGoalId, { newUpdates: true });
      }
    } else {
      const rootGoal = await getGoal(rootGoalId);
      if (rootGoal?.newUpdates) {
        await updateGoal(rootGoalId, { newUpdates: false });
      }
    }
  } catch (error) {
    console.error("[checkAndUpdateGoalNewUpdatesStatus] Error checking inbox:", error);
  }
};
