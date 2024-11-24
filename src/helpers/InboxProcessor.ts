import { GoalItem, typeOfSub } from "@src/models/GoalItem";
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
import { addGoalChangesInID, createEmptyInboxItem, getInboxItem } from "@src/api/InboxAPI";
import {
  addGoalsInSharedWM,
  archiveSharedWMGoal,
  getSharedWMGoal,
  removeSharedWMChildrenGoals,
  removeSharedWMGoal,
  updateSharedWMGoal,
  updateSharedWMParentSublist,
} from "@src/api/SharedWMAPI";
import { ITagChangesSchemaVersion, ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { fixDateVlauesInGoalObject } from "@src/utils";
import { getDeletedGoal, restoreUserGoal } from "@src/api/TrashAPI";
import { getContactByRelId } from "@src/api/ContactsAPI";
import { getAllDescendants, getRootGoalId, updateRootGoalNotification } from "./GoalController";
import { isIncomingGoalLatest, isIncomingIdChangeLatest } from "./mergeSharedGoalItems";

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

const addChangesToRootGoal = async (goalId: string, relId: string, changes: ChangesByType) => {
  const rootGoalId = await getRootGoalId(goalId);
  if (rootGoalId === "root") return;

  const inbox = await getInboxItem(rootGoalId);
  if (!inbox) {
    await createEmptyInboxItem(rootGoalId);
  }

  await Promise.all([updateRootGoalNotification(rootGoalId), addGoalChangesInID(rootGoalId, relId, changes)]);
};

const handleSubgoalsChanges = async (
  changes: changesInGoal[],
  changeType: typeOfChange,
  rootGoalId: string,
  relId: string,
  type: string,
) => {
  const rootGoal = await getGoal(rootGoalId);
  if (!rootGoal) {
    console.warn("[handleSubgoalsChanges] Root goal not found:", rootGoalId);
    return;
  }

  if (!rootGoal.participants.find((p) => p.relId === relId && p.following)) {
    console.warn("[handleSubgoalsChanges] Participant not found or not following:", relId);
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
  if (!inbox) {
    await createEmptyInboxItem(rootGoalId);
  }

  const defaultChanges = getDefaultValueOfGoalChanges();
  (defaultChanges[changeType] as changesInGoal[]) = goalsWithParticipants.map((ele) => ({
    ...ele,
    intent: type as typeOfIntent,
  }));

  await addChangesToRootGoal(rootGoalId, relId, defaultChanges);
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
    if (payload.changeType === "subgoals") {
      const changes = [
        ...payload.changes.map((ele: changesInGoal) => ({ ...ele, goal: fixDateVlauesInGoalObject(ele.goal) })),
      ];
      await addGoalsInSharedWM([changes[0].goal], relId);
    } else if (payload.changeType === "newGoalMoved") {
      const changes = [
        ...payload.changes.map((ele: changesInGoal) => ({ ...ele, goal: fixDateVlauesInGoalObject(ele.goal) })),
      ];
      changes.map(async (ele) => {
        await addGoalsInSharedWM([ele.goal], relId);
      });
    } else if (payload.changeType === "modifiedGoals") {
      const changes = [
        ...payload.changes.map((ele: changesInGoal) => ({ ...ele, goal: fixDateVlauesInGoalObject(ele.goal) })),
      ];
      await updateSharedWMGoal(changes[0].goal.id, changes[0].goal);
    } else if (payload.changeType === "deleted") {
      const change = payload.changes[0] as changesInId;
      const goalToBeDeleted = await getSharedWMGoal(change.id);
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
      const change = payload.changes[0] as changesInId;
      getSharedWMGoal(change.id).then(async (goal: GoalItem) =>
        archiveSharedWMGoal(goal).catch((err) => console.log(err, "failed to archive")),
      );
    } else if (payload.changeType === "restored") {
      const change = payload.changes[0] as changesInId;
      const goalToBeRestored = await getDeletedGoal(change.id);
      if (goalToBeRestored) {
        await restoreUserGoal(goalToBeRestored, true);
      }
    } else if (payload.changeType === "moved") {
      const changes = [
        ...payload.changes.map((ele: changesInGoal) => ({ ...ele, goal: fixDateVlauesInGoalObject(ele.goal) })),
      ];
      const movedGoal = changes[0].goal;
      const correspondingSharedWMGoal = await getSharedWMGoal(movedGoal.id);

      if (!correspondingSharedWMGoal) {
        console.log("Goal to move not found");
        return;
      }

      await handleMoveOperation(movedGoal, correspondingSharedWMGoal);
    }
  } else if (["sharer", "suggestion"].includes(payload.type)) {
    const { changes, changeType, rootGoalId } = payload;
    if (changeType === "subgoals" || changeType === "newGoalMoved") {
      await handleSubgoalsChanges(changes as changesInGoal[], changeType, rootGoalId, relId, payload.type);
      return;
    }

    const goalId = "goal" in changes[0] ? changes[0].goal.id : changes[0].id;
    const localGoal = await getGoal(goalId);

    if (!localGoal || !localGoal.participants.find((p) => p.relId === relId && p.following)) {
      console.log("Goal not found or not shared with participant");
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

    const inbox = await getInboxItem(localGoal.id);
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

    if (!inbox) {
      await createEmptyInboxItem(localGoal.id);
    }

    await addChangesToRootGoal(localGoal.id, relId, defaultChanges);
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
    start: finalChanges.start ? new Date(finalChanges.start) : null,
    due: finalChanges.due ? new Date(finalChanges.due) : null,
  });
};
