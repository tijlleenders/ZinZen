import {
  getAllLevelGoalsOfId,
  ILevelGoals,
  unarchiveUserGoal,
  updateSharedStatusOfGoal,
  updateTimestamp,
} from "@src/api/GoalsAPI";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { createGoal, modifyGoal } from "@src/controllers/GoalController";
import { suggestChanges, suggestNewGoal } from "@src/controllers/PartnerController";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast, lastAction } from "@src/store";

import { useLocation, useParams } from "react-router-dom";

import { useSetRecoilState } from "recoil";
import { shareGoalWithContact } from "@src/services/contact.service";
import { addToSharingQueue } from "@src/api/ContactsAPI";
import { ILocationState } from "@src/Interfaces";
import { hashObject } from "@src/utils";
import { removeBackTicks } from "@src/utils/patterns";
import { GoalActions } from "@src/constants/actions";
import { findMostRecentSharedAncestor } from "@components/MoveGoal/MoveGoalHelper";
import { createSharedGoalObject } from "@src/utils/sharedGoalUtils";

const useGoalActions = () => {
  const { state }: { state: ILocationState } = useLocation();
  const { partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;
  const setLastAction = useSetRecoilState(lastAction);
  const subGoalsHistory = state?.goalsHistory || [];

  const setShowToast = useSetRecoilState(displayToast);

  const ancestors = subGoalsHistory.map((ele) => ele.goalID);

  const showMessage = (message: string, extra = "") => {
    setShowToast({
      open: true,
      message,
      extra,
    });
  };

  const restoreDeletedGoal = async (goal: GoalItem) => {
    return restoreUserGoal(goal, goal.typeOfGoal === "shared").then(() => {
      setLastAction(GoalActions.GOAL_RESTORED);
    });
  };

  const restoreArchivedGoal = async (goal: GoalItem, action: GoalActions.GOAL_RESTORED | GoalActions.NONE) => {
    return unarchiveUserGoal(goal).then(() => {
      if (action === GoalActions.NONE) return;
      setLastAction(action);
    });
  };

  const updateGoal = async (goal: GoalItem, updatedHintOption: boolean, goalToCompare: GoalItem) => {
    const titleContainsCode = /```/.test(goal.title);
    if (goal.sublist.length > 0 && titleContainsCode) {
      showMessage("Action Failed!!", "Cannot update the title to include code if the goal has a subgoal.");
      return;
    }

    if (isPartnerModeActive) {
      let rootGoal = goal;
      if (state.goalsHistory && state.goalsHistory.length > 0) {
        const notificationGoalId = state.goalsHistory[0].goalID;
        rootGoal = (await getSharedWMGoalById(notificationGoalId)) || goal;
      }
      suggestChanges(rootGoal, goal, subGoalsHistory.length);
    } else if (goalToCompare && hashObject({ ...goalToCompare }) !== hashObject(goal)) {
      await modifyGoal(goal.id, goal, [...ancestors, goal.id], updatedHintOption);
    }
  };

  const addGoal = async (newGoal: GoalItem, hintOption: boolean, parentGoal?: GoalItem) => {
    // handle partner mode
    if (isPartnerModeActive && subGoalsHistory.length) {
      const notificationGoalId = subGoalsHistory[0].goalID;
      const rootGoal = await getSharedWMGoalById(notificationGoalId);
      if (!parentGoal || !rootGoal) {
        return;
      }
      suggestNewGoal(newGoal, parentGoal, rootGoal, subGoalsHistory.length);
    } else {
      // handle regular mode
      await updateTimestamp(newGoal.parentGoalId);
      await createGoal(newGoal, newGoal.parentGoalId, ancestors, hintOption);
    }
  };

  const shareGoalWithRelId = async (relId: string, name: string, goal: GoalItem) => {
    // Fetch goal hierarchy
    const goalWithChildrens: ILevelGoals[] = await getAllLevelGoalsOfId(goal.id, true);

    const sharedAncestorId = await findMostRecentSharedAncestor(goal.parentGoalId, relId);

    // Create modified copies of all goals with appropriate sharing properties
    const updatedGoalWithChildrens = goalWithChildrens.map((goalNode) => ({
      ...goalNode,
      goals: goalNode.goals.map((goalItem) => {
        const sharedGoal = createSharedGoalObject({
          ...goalItem,
          parentGoalId: goalItem.id === goal.id ? sharedAncestorId : goalItem.parentGoalId, // if we want to share a subgoal, then we need to set the parentGoalId to the root goal
          notificationGoalId: goalItem.id === goal.id ? goal.id : goalItem.notificationGoalId, // if we want to share a subgoal, then we need to set the notificationGoalId to the goal id
        });
        return sharedGoal;
      }),
    }));

    // Share the goals with the contact
    await shareGoalWithContact(relId, updatedGoalWithChildrens, sharedAncestorId);

    try {
      // Update sharing status for all goals
      await Promise.all(
        updatedGoalWithChildrens.flatMap((goalNode) =>
          goalNode.goals.map((goalItem) => updateSharedStatusOfGoal(goalItem.id, relId, name)),
        ),
      );
    } catch (error) {
      console.error("[shareGoalWithRelId] Error updating shared status:", error);
    }

    showMessage(`Cheers!! Your goal and its subgoals are shared with ${name}`);
  };

  const addContact = async (relId: string, goalId: string) => {
    await addToSharingQueue(relId, goalId).catch(() => {
      console.log("Unable to add this goal in queue");
    });
    navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
    showMessage(
      "Link copied to clipboard",
      "Paste this link in a chat message to your partner so they can accept the request and start receiving what you shared automatically",
    );
  };

  const copyCode = (title: string) => {
    let goalTitle = removeBackTicks(title);
    navigator.clipboard.writeText(goalTitle);
    const MAX_LENGTH = 15;
    if (goalTitle.length > MAX_LENGTH) {
      goalTitle = `${goalTitle
        .split(" ")
        .slice(0, MAX_LENGTH - 1)
        .join(" ")}...`;
    }
    goalTitle = `${goalTitle} copied!`;
    showMessage("Code copied to clipboard", goalTitle);
  };
  return {
    addGoal,
    restoreDeletedGoal,
    restoreArchivedGoal,
    updateGoal,
    shareGoalWithRelId,
    addContact,
    copyCode,
  };
};

export default useGoalActions;
