import { GoalItem } from "@src/models/GoalItem";
import { changesInGoal, changesInId, InboxItem } from "@src/models/InboxItem";

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
import { isIncomingGoalLatest } from "./mergeSharedGoalItems";

export interface Payload {
  relId: string;
  lastProcessedTimestamp: string;
  changeType: string;
  rootGoalId: string;
  changes: (changesInGoal | changesInId)[];
  type: string;
  timestamp: string;
  TTL: number;
}

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
    if (payload.changeType === "subgoals" || payload.changeType === "newGoalMoved") {
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
    const { changes, changeType } = payload;
    console.log("changes", changes);

    let goal: GoalItem | null = null;

    if ("goal" in changes[0]) {
      const goalId =
        changeType === "subgoals" || changeType === "newGoalMoved" ? changes[0].goal.parentGoalId : changes[0].goal.id;

      goal = await getGoal(goalId);
    } else {
      goal = await getGoal(changes[0].id);
    }

    if (!goal) {
      console.log("Goal not found");
      return;
    }

    if (!goal.participants.find((p) => p.relId === relId && p.following)) {
      console.log("Changes ignored - goal not shared with participant");
      return;
    }

    let allAreLatest: (changesInGoal | changesInId | null)[] = [];

    if (payload.changeType === "deleted" || payload.changeType === "moved") {
      allAreLatest = changes.map((ele) => ele);
    } else {
      allAreLatest = await Promise.all(
        changes.map(async (ele) => {
          const isLatest = await isIncomingGoalLatest(ele.goal.id, ele.goal);
          return isLatest ? ele : null;
        }),
      );
    }

    const filteredChanges = allAreLatest.filter((ele) => ele !== null);

    if (filteredChanges.length > 0) {
      console.log("Found latest changes. Proceeding with updates...");

      let inbox: InboxItem = await getInboxItem(goal.id);
      const defaultChanges = getDefaultValueOfGoalChanges();

      defaultChanges[changeType] = filteredChanges.map((ele) => ({
        ...ele,
        intent: payload.type,
      }));

      if (!inbox) {
        await createEmptyInboxItem(goal.id);
        inbox = await getInboxItem(goal.id);
      }

      await Promise.all([
        updateGoal(goal.id, { newUpdates: true }),
        addGoalChangesInID(goal.id, relId, defaultChanges),
      ]);
    } else {
      console.log("No latest changes. Skipping updates.");
    }
  }
};

export const acceptSelectedSubgoals = async (selectedGoals: GoalItem[], parentGoal: GoalItem) => {
  try {
    const childrens: string[] = [];
    selectedGoals.forEach(async (goal: GoalItem) => {
      addGoal(fixDateVlauesInGoalObject({ ...goal, participants: [] })).catch((err) => console.log(err));
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
