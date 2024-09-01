import { getAllLevelGoalsOfId, unarchiveUserGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { createGoal, deleteGoal, deleteSharedGoal, modifyGoal } from "@src/helpers/GoalController";
import { suggestChanges, suggestNewGoal } from "@src/helpers/PartnerController";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast, lastAction, openDevMode } from "@src/store";

import { useLocation, useParams } from "react-router-dom";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import plingSound from "@assets/pling.mp3";

import { useSetRecoilState } from "recoil";
import { shareGoalWithContact } from "@src/services/contact.service";
import { addToSharingQueue } from "@src/api/ContactsAPI";
import { ILocationState } from "@src/Interfaces";
import { hashObject } from "@src/utils";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import { removeBackTicks } from "@src/utils/patterns";

const useGoalActions = () => {
  const { state }: { state: ILocationState } = useLocation();
  const { partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;
  const setLastAction = useSetRecoilState(lastAction);
  const setDevMode = useSetRecoilState(openDevMode);
  const subGoalsHistory = state?.goalsHistory || [];
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);
  const { goal: activeGoal } = useActiveGoalContext();

  const setShowToast = useSetRecoilState(displayToast);
  const pageCrumple = new Audio(pageCrumplingSound);

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
    setLastAction("goalDeleted");
  };

  const restoreDeletedGoal = async (goal: GoalItem) => {
    return restoreUserGoal(goal, goal.typeOfGoal === "shared").then(() => {
      setLastAction("goalRestored");
    });
  };

  const restoreArchivedGoal = async (goal: GoalItem, action: "goalRestored" | "none") => {
    return unarchiveUserGoal(goal).then(() => {
      if (action === "none") return;
      setLastAction(action);
    });
  };

  const updateGoal = async (goal: GoalItem, hints: boolean) => {
    const addGoalSound = new Audio(plingSound);
    const titleContainsCode = /```/.test(goal.title);
    if (goal.sublist.length > 0 && titleContainsCode) {
      showMessage("Action Failed!!", "Cannot update the title to include code if the goal has a subgoal.");
      return;
    }
    if (isPartnerModeActive) {
      let rootGoal = goal;
      if (state.goalsHistory && state.goalsHistory.length > 0) {
        const rootGoalId = state.goalsHistory[0].goalID;
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goal;
      }
      suggestChanges(rootGoal, goal, subGoalsHistory.length);
    } else if (activeGoal && hashObject(activeGoal) !== hashObject(goal)) {
      // Comparing hashes of the old (activeGoal) and updated (goal) versions to check if the goal has changed
      await modifyGoal(goal.id, goal, [...ancestors, goal.id], hints);
      setLastAction("goalUpdated");
      setShowToast({
        open: true,
        message: "Goal updated!",
        extra: "",
      });
      addGoalSound.play();
    }
  };

  const addGoal = async (newGoal: GoalItem, hints: boolean, parentGoal?: GoalItem) => {
    if (isPartnerModeActive && subGoalsHistory.length) {
      const rootGoalId = subGoalsHistory[0].goalID;
      const rootGoal = await getSharedWMGoalById(rootGoalId);
      if (!parentGoal || !rootGoal) {
        return;
      }
      suggestNewGoal(newGoal, parentGoal, rootGoal, subGoalsHistory.length);
    } else {
      await createGoal(newGoal, newGoal.parentGoalId, ancestors, hints);
      if (!parentGoal && newGoal.title === "magic") {
        setDevMode(true);
        showMessage("Congratulations, you activated DEV mode", "Explore what's hidden");
      }
      setLastAction("goalItemCreated");
    }
  };

  const shareGoalWithRelId = async (relId: string, name: string, goal: GoalItem) => {
    const goalWithChildrens = await getAllLevelGoalsOfId(goal.id, true);
    await shareGoalWithContact(relId, [
      ...goalWithChildrens.map((ele) => ({
        ...ele,
        participants: [],
        parentGoalId: ele.id === goal.id ? "root" : ele.parentGoalId,
        rootGoalId: goal.id,
      })),
    ]);
    updateSharedStatusOfGoal(goal.id, relId, name).then(() => console.log("status updated"));
    showMessage(`Cheers!!, Your goal is shared with ${name}`);
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

  const copyCode = (goalTitle: string) => {
    goalTitle = removeBackTicks(goalTitle);
    navigator.clipboard.writeText(goalTitle);
    const MAX_LENGTH = 15;
    if (goalTitle.length > MAX_LENGTH) {
      goalTitle =
        `${goalTitle
          .split(" ")
          .slice(0, MAX_LENGTH - 1)
          .join(" ")}` + "...";
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
