import { getAllLevelGoalsOfId, ILevelGoals, unarchiveUserGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { createGoal, deleteGoal, deleteSharedGoal, modifyGoal } from "@src/controllers/GoalController";
import { suggestChanges, suggestNewGoal } from "@src/controllers/PartnerController";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast, lastAction, openDevMode } from "@src/store";

import { useLocation, useParams } from "react-router-dom";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import plingSound from "@assets/pling.mp3";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { shareGoalWithContact } from "@src/services/contact.service";
import { addToSharingQueue } from "@src/api/ContactsAPI";
import { ILocationState } from "@src/Interfaces";
import { hashObject } from "@src/utils";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import { removeBackTicks } from "@src/utils/patterns";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { GoalActions } from "@src/constants/actions";
import { findMostRecentSharedAncestor } from "@components/MoveGoal/MoveGoalHelper";

const pageCrumple = new Audio(pageCrumplingSound);
const addGoalSound = new Audio(plingSound);

const useGoalActions = () => {
  const { state }: { state: ILocationState } = useLocation();
  const { partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;
  const setLastAction = useSetRecoilState(lastAction);
  const setDevMode = useSetRecoilState(openDevMode);
  const subGoalsHistory = state?.goalsHistory || [];
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);
  const { goal: activeGoal } = useActiveGoalContext();
  const suggestedGoal = useRecoilValue(suggestedGoalState);

  const setShowToast = useSetRecoilState(displayToast);

  const showMessage = (message: string, extra = "") => {
    setShowToast({
      open: true,
      message,
      extra,
    });
  };
  const deleteGoalAction = async (goal: GoalItem) => {
    pageCrumple.play();
    if (isPartnerModeActive) {
      await deleteSharedGoal(goal);
    } else {
      await deleteGoal(goal, ancestors);
    }
    if (goal.title === "magic" && goal.parentGoalId === "root") {
      setDevMode(false);
    }
    setLastAction(GoalActions.GOAL_DELETED);
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

  const updateGoal = async (goal: GoalItem, updatedHintOption: boolean) => {
    const currentHintItem = await getGoalHintItem(goal.id);

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
    } else if (
      activeGoal &&
      (hashObject({ ...activeGoal }) !== hashObject(goal) || currentHintItem?.hintOptionEnabled !== updatedHintOption)
    ) {
      // Comparing hashes of the old (activeGoal) and updated (goal) versions to check if the goal has changed
      await modifyGoal(goal.id, goal, [...ancestors, goal.id], updatedHintOption);
      setLastAction(GoalActions.GOAL_UPDATED);
      setShowToast({
        open: true,
        message: suggestedGoal ? "Goal (re)created!" : "Goal updated!",
        extra: "",
      });
      addGoalSound.play();
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
      await createGoal(newGoal, newGoal.parentGoalId, ancestors, hintOption);
      if (!parentGoal && newGoal.title === "magic") {
        setDevMode(true);
        showMessage("Congratulations, you activated DEV mode", "Explore what's hidden");
      }
      setLastAction(GoalActions.GOAL_ITEM_CREATED);
    }
  };

  const shareGoalWithRelId = async (relId: string, name: string, goal: GoalItem) => {
    // Fetch goal hierarchy
    const goalWithChildrens: ILevelGoals[] = await getAllLevelGoalsOfId(goal.id, true);

    const sharedAncestorId = await findMostRecentSharedAncestor(goal.parentGoalId, relId);

    // Create modified copies of all goals with appropriate sharing properties
    const updatedGoalWithChildrens = goalWithChildrens.map((goalNode) => ({
      ...goalNode,
      goals: goalNode.goals.map((goalItem) => ({
        ...goalItem,
        participants: [], // remove participants before sharing
        parentGoalId: goalItem.id === goal.id ? "root" : goalItem.parentGoalId, // if we want to share a subgoal, then we need to set the parentGoalId to the root goal
        notificationGoalId: goalItem.id === goal.id ? goal.id : goalItem.notificationGoalId, // if we want to share a subgoal, then we need to set the notificationGoalId to the goal id
      })),
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
    deleteGoalAction,
    restoreDeletedGoal,
    restoreArchivedGoal,
    updateGoal,
    shareGoalWithRelId,
    addContact,
    copyCode,
  };
};

export default useGoalActions;
