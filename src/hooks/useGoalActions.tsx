import { getAllLevelGoalsOfId, getGoal, unarchiveUserGoal, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { restoreGoal } from "@src/api/TrashAPI";
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
    await pageCrumple.play();
    if (isPartnerModeActive) {
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
    let isGoalChanged = false;
    const addGoalSound = new Audio(plingSound);

    if (isPartnerModeActive) {
      let rootGoal = goal;
      if (state.goalsHistory && state.goalsHistory.length > 0) {
        const rootGoalId = state.goalsHistory[0].goalID;
        rootGoal = (await getSharedWMGoalById(rootGoalId)) || goal;
      }
      suggestChanges(rootGoal, goal, subGoalsHistory.length);
    } else if (activeGoal && hashObject(activeGoal) !== hashObject(goal)) {
      // Comparing hashes of the old (activeGoal) and updated (goal) versions to check if the goal has changed
      isGoalChanged = true;
      await modifyGoal(goal.id, goal, [...ancestors, goal.id], hints);
    }

    if (isGoalChanged) {
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
  return {
    addGoal,
    deleteGoalAction,
    restoreDeletedGoal,
    restoreArchivedGoal,
    updateGoal,
    shareGoalWithRelId,
    addContact,
  };
};

export default useGoalActions;
