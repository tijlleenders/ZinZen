import { getAllLevelGoalsOfId, unarchiveUserGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { restoreGoal } from "@src/api/TrashAPI";
import { createGoal, deleteGoal, deleteSharedGoal, modifyGoal } from "@src/helpers/GoalController";
import { suggestChanges, suggestNewGoal } from "@src/helpers/PartnerController";
import { GoalItem } from "@src/models/GoalItem";
import { displayPartnerMode, displayToast, lastAction, openDevMode } from "@src/store";
import { goalsHistory } from "@src/store/GoalsState";
import { useLocation } from "react-router-dom";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { shareGoalWithContact } from "@src/services/contact.service";
import { addToSharingQueue } from "@src/api/ContactsAPI";
import { removeBackTicks } from "@src/utils";

const useGoalActions = () => {
  const { state } = useLocation();
  const setLastAction = useSetRecoilState(lastAction);
  const setDevMode = useSetRecoilState(openDevMode);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const ancestors = subGoalsHistory.map((ele) => ele.goalID);
  const showPartnerMode = useRecoilValue(displayPartnerMode);
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
    await pageCrumple.play();
    if (showPartnerMode) {
      await deleteSharedGoal(goal);
    } else {
      await deleteGoal(goal, ancestors);
    }
    if (goal.title === "magic" && goal.parentGoalId === "root") {
      setDevMode(false);
    }
    setLastAction("goalRestored");
  };

  const restoreDeletedGoal = async (goal: GoalItem) => {
    return restoreGoal(goal, goal.typeOfGoal === "shared").then(() => {
      setLastAction("goalRestored");
    });
  };

  const restoreArchivedGoal = async (goal: GoalItem) => {
    return unarchiveUserGoal(goal).then(() => {
      setLastAction("goalRestored");
    });
  };

  const updateGoal = async (goal: GoalItem, hints: boolean) => {
    if (state.displayPartnerMode) {
      let rootGoal = goal;
      if (state.goalsHistory && state.goalsHistory.length > 0) {
        const rootGoalId = state.goalsHistory[0].goalID;
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goal;
      }
      suggestChanges(rootGoal, goal, subGoalsHistory.length);
    } else {
      await modifyGoal(goal.id, goal, [...ancestors, goal.id], hints);
    }
    setLastAction("goalUpdated");
  };

  const addGoal = async (newGoal: GoalItem, hints: boolean, parentGoal?: GoalItem) => {
    if (state.displayPartnerMode && state.goalsHistory) {
      const rootGoalId = state.goalsHistory[0].goalID;
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
    const MAX_LENGTH = 15;

    if (goalTitle.length > MAX_LENGTH) {
      goalTitle = `${goalTitle.split(" ").slice(0, MAX_LENGTH)}...`;
    }

    navigator.clipboard
      .writeText(removeBackTicks(goalTitle))
      .then(() => showMessage("Code copied to clipboard", removeBackTicks(goalTitle)))
      .catch((err) => console.error("Failed to copy text: ", err));
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
