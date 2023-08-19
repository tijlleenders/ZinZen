import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ILocationState } from "@src/Interfaces";
import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { displayInbox, displayConfirmation } from "@src/store";
import {
  displayAddGoal,
  displayGoalId,
  goalsHistory,
  displayUpdateGoal,
  displayShareModal,
  displayGoalActions,
} from "@src/store/GoalsState";

const GoalLocStateHandler = () => {
  const location = useLocation();
  const [showInbox, setShowInbox] = useRecoilState(displayInbox);

  const setSelectedGoalId = useSetRecoilState(displayGoalId);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showShareModal, setShowShareModal] = useRecoilState(displayShareModal);
  const [showConfirmation, setShowConfirmation] = useRecoilState(displayConfirmation);
  const [showGoalActions, setShowGoalActions] = useRecoilState(displayGoalActions);

  const handleLocationChange = () => {
    const locationState: ILocationState = location.state || {};
    getActiveSharedWMGoals().then((items) => {
      if (items && items.length > 0) {
        if (!showInbox) {
          setShowInbox(true);
        }
      } else if (showInbox) {
        setShowInbox(false);
      }
    });
    if (subGoalHistory.length > 0 || ("goalsHistory" in locationState && "activeGoalId" in locationState)) {
      setSubGoalHistory([...(locationState.goalsHistory || [])]);
      setSelectedGoalId(locationState.activeGoalId || "root");
    }
    if (showGoalActions && !locationState.displayGoalActions) {
      setShowGoalActions(null);
    } else if (locationState.displayGoalActions) {
      setShowGoalActions(locationState.displayGoalActions);
    }
    if (showAddGoal && !locationState.displayAddGoal) {
      setShowAddGoal(null);
    } else if (locationState.displayAddGoal) {
      setShowAddGoal({ open: true, goalId: locationState.displayAddGoal });
    }
    if (showUpdateGoal && !locationState.displayUpdateGoal) {
      setShowUpdateGoal(null);
    } else if (locationState.displayUpdateGoal) {
      setShowUpdateGoal({ open: true, goalId: locationState.displayUpdateGoal });
    }
    if (showShareModal && !locationState.displayShareModal) {
      setShowShareModal(null);
    } else if (locationState.displayShareModal) {
      setShowShareModal(locationState.displayShareModal);
    }
    if (showConfirmation.open && !locationState.displayConfirmation) {
      setShowConfirmation({ ...showConfirmation, open: false });
    } else if (locationState.displayConfirmation) {
      setShowConfirmation(locationState.displayConfirmation);
    }
  };

  useEffect(() => {
    if (location && location.pathname === "/MyGoals") {
      handleLocationChange();
    }
  }, [location]);

  return null;
};

export default GoalLocStateHandler;
