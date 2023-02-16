import { GoalItem } from "@src/models/GoalItem";
import { InboxItem } from "@src/models/InboxItem";

import { getDefaultValueOfGoalChanges } from "@src/utils/defaultGenerators";
import { changeNewUpdatesStatus, getGoal, notifyNewColabRequest } from "@src/api/GoalsAPI";
import { addGoalChangesInID, createEmptyInboxItem, getInboxItem } from "@src/api/InboxAPI";
import { addGoalsInSharedWM, archiveSharedWMGoal, getSharedWMGoal, removeSharedWMChildrenGoals, removeSharedWMGoal, updateSharedWMGoal } from "@src/api/SharedWMAPI";

export const handleIncomingChanges = async (payload) => {
  if (payload.type === "shared") {
    if (payload.changeType === "subgoals") {
      await addGoalsInSharedWM([payload.changes[0].goal]);
    } else if (payload.changeType === "modifiedGoals") {
      await updateSharedWMGoal(payload.changes[0].goal.id, payload.changes[0].goal);
    } else if (payload.changeType === "deleted") {
      await removeSharedWMChildrenGoals(payload.changes[0].id);
      await removeSharedWMGoal(payload.changes[0].id);
      getSharedWMGoal(payload.changes[0].id).then((goal: GoalItem) => {
        if (goal.parentGoalId !== "root") {
          getSharedWMGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
            const parentGoalSublist = parentGoal.sublist;
            const childGoalIndex = parentGoalSublist.indexOf(goal.id);
            if (childGoalIndex !== -1) { parentGoalSublist.splice(childGoalIndex, 1); }
            await updateSharedWMGoal(parentGoal.id, { sublist: parentGoalSublist });
          });
        }
      });
    } else if (payload.changeType === "archived") {
      getSharedWMGoal(payload.changes[0].id).then(async (goal: GoalItem) => archiveSharedWMGoal(goal).catch((err) => console.log(err, "failed to archive")));
    }
  } else if (payload.type === "collaborationInvite") {
    notifyNewColabRequest(payload.goal.id, payload.relId).catch(() => console.log("failed to notify about new colab"));
  } else if (payload.type === "collaboration") {
    const { rootGoalId, changes, changeType } = payload;
    const rootGoal = await getGoal(rootGoalId);
    if (rootGoal.typeOfGoal === "collaboration") {
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
      changeNewUpdatesStatus(true, rootGoalId).catch((err) => console.log(err));
      // @ts-ignore
      await addGoalChangesInID(rootGoalId, defaultChanges);
    }
  }
};
