import { GoalItem, typeOfSub } from "@src/models/GoalItem";
import { changesInGoal, changesInId, typeOfChange, typeOfIntent } from "@src/models/InboxItem";

import { getDefaultValueOfGoalChanges } from "@src/utils/defaultGenerators";
import {
  addGoal,
  addIntoSublist,
  // changeNewUpdatesStatus,
  getGoal,
  updateGoal,
} from "@src/api/GoalsAPI";
import { addGoalChangesInID, createEmptyInboxItem, getInboxItem } from "@src/api/InboxAPI";
import {
  addGoalsInSharedWM,
  archiveSharedWMGoal,
  getSharedWMGoal,
  removeSharedWMChildrenGoals,
  removeSharedWMGoal,
  updateSharedWMGoal,
} from "@src/api/SharedWMAPI";
import { ITagChangesSchemaVersion, ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { fixDateVlauesInGoalObject } from "@src/utils";
import { getDeletedGoal, restoreUserGoal } from "@src/api/TrashAPI";
import { getContactByRelId } from "@src/api/ContactsAPI";
import { isIncomingGoalLatest } from "./mergeSharedGoalItems";
import { getRootGoalId, updateRootGoalNotification } from "./GoalController";

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

const addChangesToRootGoal = async (goalId: string, relId: string, changes: any) => {
  const rootGoalId = await getRootGoalId(goalId);
  if (rootGoalId === "root") return;

  const inbox = await getInboxItem(rootGoalId);
  if (!inbox) {
    await createEmptyInboxItem(rootGoalId);
  }

  await Promise.all([updateRootGoalNotification(rootGoalId), addGoalChangesInID(rootGoalId, relId, changes)]);
};

export const handleIncomingChanges = async (payload: Payload, relId: string) => {
  console.log("Incoming change", payload);

  if (payload.changeType === "moved") {
    const rootGoal = await getGoal(payload.rootGoalId);
    const currentGoal = await getGoal(payload.changes[0].goal.id);

    if (rootGoal) {
      const movedGoal = payload.changes[0].goal;
      const newParentGoal = await getGoal(movedGoal.parentGoalId);
      if (
        currentGoal?.participants.find((ele) => ele.relId === relId && ele.following) !== undefined &&
        !newParentGoal
      ) {
        return;
      }
    }
  }

  if (payload.type === "sharer" && (await getSharedWMGoal(payload.rootGoalId))) {
    console.log("Incoming change is a shared goal. Processing...");
    const incGoal = await getSharedWMGoal(payload.rootGoalId);
    if (!incGoal || incGoal.participants.find((ele) => ele.relId === relId && ele.following) === undefined) {
      console.log("Changes ignored");
      return;
    }
    if (payload.changeType === "subgoals") {
      const changes = [
        ...payload.changes.map((ele: changesInGoal) => ({ ...ele, goal: fixDateVlauesInGoalObject(ele.goal) })),
      ];
      await addGoalsInSharedWM([changes[0].goal]);
    } else if (payload.changeType === "modifiedGoals") {
      const changes = [
        ...payload.changes.map((ele: changesInGoal) => ({ ...ele, goal: fixDateVlauesInGoalObject(ele.goal) })),
      ];
      await updateSharedWMGoal(changes[0].goal.id, changes[0].goal);
    } else if (payload.changeType === "deleted") {
      const goalToBeDeleted = await getSharedWMGoal(payload.changes[0].goal.id);
      console.log("Deleting goal", goalToBeDeleted);
      await removeSharedWMChildrenGoals(goalToBeDeleted.id);
      await removeSharedWMGoal(goalToBeDeleted);
      if (goalToBeDeleted.parentGoalId !== "root") {
        getSharedWMGoal(goalToBeDeleted.parentGoalId).then(async (parentGoal: GoalItem) => {
          const parentGoalSublist = parentGoal.sublist;
          const childGoalIndex = parentGoalSublist.indexOf(goalToBeDeleted.id);
          if (childGoalIndex !== -1) {
            parentGoalSublist.splice(childGoalIndex, 1);
          }
          await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
        });
      }
    } else if (payload.changeType === "archived") {
      getSharedWMGoal(payload.changes[0].id).then(async (goal: GoalItem) =>
        archiveSharedWMGoal(goal).catch((err) => console.log(err, "failed to archive")),
      );
    } else if (payload.changeType === "restored") {
      const goalToBeRestored = await getDeletedGoal(payload.changes[0].id);
      if (goalToBeRestored) {
        await restoreUserGoal(goalToBeRestored, true);
      }
    }
  } else if (["sharer", "suggestion"].includes(payload.type)) {
    const { changes, changeType, rootGoalId } = payload;
    if (changeType === "subgoals") {
      const rootGoal = await getGoal(rootGoalId);
      if (!rootGoal || !rootGoal.participants.find((p) => p.relId === relId && p.following)) {
        return;
      }

      const contact = await getContactByRelId(relId);

      const goalsWithParticipants = changes.map((ele: changesInGoal) => ({
        ...ele,
        goal: {
          ...fixDateVlauesInGoalObject(ele.goal),
          participants: [{ relId, following: true, type: "sharer" as typeOfSub, name: contact?.name || "" }],
        },
      }));

      const inbox = await getInboxItem(rootGoalId);
      const defaultChanges = getDefaultValueOfGoalChanges();
      defaultChanges[changeType] = [
        ...goalsWithParticipants.map((ele) => ({ ...ele, intent: payload.type as typeOfIntent })),
      ];

      if (!inbox) {
        await createEmptyInboxItem(rootGoalId);
      }

      await addChangesToRootGoal(rootGoalId, relId, defaultChanges);
      return;
    }

    const goalId = "goal" in changes[0] ? changes[0].goal.id : changes[0].id;
    const goal = await getGoal(goalId);

    if (!goal || !goal.participants.find((p) => p.relId === relId && p.following)) {
      console.log("Goal not found or not shared with participant");
      return;
    }

    let filteredChanges = changes;
    if (changeType !== "deleted" && changeType !== "moved") {
      const latestChanges = await Promise.all(
        changes.map(async (ele) => {
          const isLatest = await isIncomingGoalLatest(ele.goal.id, ele.goal);
          return isLatest ? ele : null;
        }),
      );
      filteredChanges = latestChanges.filter((ele): ele is changesInGoal => ele !== null);
    }

    if (filteredChanges.length === 0) {
      return;
    }

    const inbox = await getInboxItem(goal.id);
    const defaultChanges = getDefaultValueOfGoalChanges();
    defaultChanges[changeType] = filteredChanges.map((ele) => ({
      ...ele,
      intent: payload.type,
    }));

    if (!inbox) {
      await createEmptyInboxItem(goal.id);
    }

    await addChangesToRootGoal(goal.id, relId, defaultChanges);
  }
};

export const acceptSelectedSubgoals = async (selectedGoals: GoalItem[], parentGoal: GoalItem) => {
  try {
    const childrens: string[] = [];
    selectedGoals.forEach(async (goal: GoalItem) => {
      const { relId } = goal.participants[0];
      const contact = await getContactByRelId(relId);
      addGoal(
        fixDateVlauesInGoalObject({
          ...goal,
          participants: [{ relId, following: true, type: "sharer", name: contact?.name || "" }],
        }),
      ).catch((err) => console.log(err));
      childrens.push(goal.id);
    });
    await addIntoSublist(parentGoal.id, childrens);
    return "Done!!";
  } catch (err) {
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
    start: finalChanges.start ? new Date(finalChanges.start) : null,
    due: finalChanges.due ? new Date(finalChanges.due) : null,
  });
};
