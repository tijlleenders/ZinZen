import { GoalItem } from "@src/models/GoalItem";
import { changesInGoal, InboxItem } from "@src/models/InboxItem";

import { getDefaultValueOfGoalChanges } from "@src/utils/defaultGenerators";
import {
  addGoal,
  addIntoSublist,
  archiveUserGoal,
  // changeNewUpdatesStatus,
  getGoal,
  notifyNewColabRequest,
  removeGoalWithChildrens,
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
import { IDisplayChangesModal, ITagChangesSchemaVersion, ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";
import { fixDateVlauesInGoalObject } from "@src/utils";

export const handleIncomingChanges = async (payload, relId) => {
  if (payload.type === "sharer") {
    const goal = await getGoal(payload.rootGoalId);
    if (!goal || goal.participants.find((ele) => ele.relId === relId && ele.following) === undefined) {
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
      await removeSharedWMChildrenGoals(payload.changes[0].id);
      await removeSharedWMGoal(payload.changes[0].id);
      getSharedWMGoal(payload.changes[0].id).then((goal: GoalItem) => {
        if (goal.parentGoalId !== "root") {
          getSharedWMGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
            const parentGoalSublist = parentGoal.sublist;
            const childGoalIndex = parentGoalSublist.indexOf(goal.id);
            if (childGoalIndex !== -1) {
              parentGoalSublist.splice(childGoalIndex, 1);
            }
            await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
          });
        }
      });
    } else if (payload.changeType === "archived") {
      getSharedWMGoal(payload.changes[0].id).then(async (goal: GoalItem) =>
        archiveSharedWMGoal(goal).catch((err) => console.log(err, "failed to archive")),
      );
    }
  } else if (payload.type === "collaborationInvite") {
    notifyNewColabRequest(payload.goal.id, payload.relId).catch(() => console.log("failed to notify about new colab"));
  } else if (["collaboration", "suggestion"].includes(payload.type)) {
    const { rootGoalId, changes, changeType, relId } = payload;
    const rootGoal = await getGoal(rootGoalId);
    if (rootGoal) {
      let inbox: InboxItem = await getInboxItem(rootGoalId);
      const defaultChanges = getDefaultValueOfGoalChanges();
      defaultChanges[changeType] = [...changes];
      if (!inbox) {
        await createEmptyInboxItem(rootGoalId);
        inbox = await getInboxItem(rootGoalId);
      }
      // const goalItemExist = changeType === "subgoals" || changeType === "modifiedGoals";
      // changes.forEach(async (ele) => {
      //   console.log(ele)
      //   changeNewUpdatesStatus(true, goalItemExist ? ele.goal.parentGoalId : ele.id).catch(() => console.log("failed parent notification", ele));
      // });
      // changeNewUpdatesStatus(true, rootGoalId).catch((err) => console.log(err));
      // @ts-ignore
      await addGoalChangesInID(rootGoalId, defaultChanges, relId);
    }
  }
};

export const acceptSelectedSubgoals = async (
  unselectedGoalIds: string[],
  showChangesModal: IDisplayChangesModal,
  parentGoal: GoalItem,
) => {
  try {
    const childrens: string[] = [];
    showChangesModal.goals.forEach(async (colabGoal: GoalItem) => {
      if (!unselectedGoalIds.includes(colabGoal.id)) {
        addGoal({
          ...fixDateVlauesInGoalObject(colabGoal),
        }).catch((err) => console.log(err));
        childrens.push(colabGoal.id);
      }
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

export const acceptChangesOf = async (
  unselectedChanges: string[],
  showChangesModal: IDisplayChangesModal,
  updateList: ITagsChanges,
  activeGoal: GoalItem | undefined,
) => {
  const goal = showChangesModal.goals[0];
  if (showChangesModal.typeAtPriority === "subgoals" && activeGoal) {
    await acceptSelectedSubgoals(unselectedChanges, showChangesModal, activeGoal);
  } else if (showChangesModal.typeAtPriority === "modifiedGoals" && updateList) {
    await acceptSelectedTags(unselectedChanges, updateList, goal);
  } else if (showChangesModal.typeAtPriority === "deleted") {
    await removeGoalWithChildrens(goal);
  } else if (showChangesModal.typeAtPriority === "archived") {
    await archiveUserGoal(goal);
  }
};
