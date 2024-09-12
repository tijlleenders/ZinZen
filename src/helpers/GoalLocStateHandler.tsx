import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ILocationState } from "@src/Interfaces";
import { displayConfirmation, displayPartner } from "@src/store";
import {
  displayAddGoal,
  displayGoalId,
  goalsHistory,
  displayUpdateGoal,
  displayShareModal,
  displayGoalActions,
  displayAddContact,
  displayParticipants,
  displayChangesModal,
} from "@src/store/GoalsState";

const GoalLocStateHandler = () => {
  const location = useLocation();
  const setSelectedGoalId = useSetRecoilState(displayGoalId);
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [activePartner, setActivePartner] = useRecoilState(displayPartner);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showShareModal, setShowShareModal] = useRecoilState(displayShareModal);
  const [showGoalActions, setShowGoalActions] = useRecoilState(displayGoalActions);
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [showParticipants, setShowParticipants] = useRecoilState(displayParticipants);
  const [showConfirmation, setShowConfirmation] = useRecoilState(displayConfirmation);
  const [showAddContactModal, setShowAddContactModal] = useRecoilState(displayAddContact);

  const handleLocationChange = () => {
    const locationState: ILocationState = location.state || {};
    if (subGoalHistory.length > 0 || ("goalsHistory" in locationState && "activeGoalId" in locationState)) {
      setSubGoalHistory([...(locationState.goalsHistory || [])]);
      setSelectedGoalId(locationState.activeGoalId || "root");
    }
    if (showChangesModal && !locationState.displayChanges) {
      setShowChangesModal(null);
    } else if (locationState.displayChanges) {
      setShowChangesModal(locationState.displayChanges);
    }
    if (activePartner && !locationState.displayPartner) {
      setActivePartner(null);
    } else if (locationState.displayPartner) {
      setActivePartner(locationState.displayPartner);
    }
    if (showParticipants && !locationState.displayParticipants) {
      setShowParticipants(null);
    } else if (locationState.displayParticipants) {
      setShowParticipants(locationState.displayParticipants);
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
    if (showAddContactModal && !locationState.displayAddContact) {
      setShowAddContactModal(false);
    } else if (locationState.displayAddContact) {
      setShowAddContactModal(!!locationState?.displayShareModal);
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
    if (location && location.pathname === "/goals") {
      handleLocationChange();
    }
  }, [location]);

  return null;
};

export default GoalLocStateHandler;
