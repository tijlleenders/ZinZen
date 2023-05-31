import { ILocationState } from "@src/Interfaces";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { displayAddGoal, displayChangesModal, displayGoalId, displayShareModal, displayUpdateGoal, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";
import { colorPalleteList } from "@src/utils";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

function useGoalStore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);

  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);
  const [showShareModal, setShowShareModal] = useRecoilState(displayShareModal);
  const [showConfirmation, setShowConfirmation] = useRecoilState(displayConfirmation);

  const setColorIndex = useSetRecoilState(selectedColorIndex);
  const handleLocationChange = () => {
    const locationState : ILocationState = location.state || {};
    if (subGoalHistory.length > 0 ||
      ("goalsHistory" in locationState && "activeGoalId" in locationState)) {
      setSubGoalHistory([...(locationState.goalsHistory || [])]);
      setSelectedGoalId(locationState.activeGoalId || "root");
    }
    if (showAddGoal) {
      setShowAddGoal(null);
    } else if (locationState.displayAddGoal) {
      setShowAddGoal({ open: true, goalId: locationState.displayAddGoal });
    }
    if (showUpdateGoal) {
      setShowUpdateGoal(null);
    } else if (locationState.displayUpdateGoal) {
      setShowUpdateGoal({ open: true, goalId: locationState.displayUpdateGoal });
    }
    if (showShareModal) {
      setShowShareModal(null);
    } else if (locationState.displayShareModal) {
      setShowShareModal(locationState.displayShareModal);
    }
    if (showConfirmation.open) {
      setShowConfirmation({ ...showConfirmation, open: false });
    } else if (locationState.displayConfirmation) {
      setShowConfirmation(locationState.displayConfirmation);
    }
  };

  const handleAddGoal = async (goal: GoalItem | null = null) => {
    let newLocationState : ILocationState = { displayAddGoal: selectedGoalId };
    if (selectedGoalId === "root") {
      setColorIndex(Math.floor((Math.random() * colorPalleteList.length) + 1));
    } else if (goal) {
      setColorIndex(colorPalleteList.indexOf(goal.goalColor));
    } else {
      await getGoal(selectedGoalId).then((fetchedGoal) => { if (fetchedGoal) setColorIndex(colorPalleteList.indexOf(fetchedGoal.goalColor)); });
    }
    if (goal) {
      newLocationState = {
        goalsHistory: [...subGoalHistory, {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "" },
        ],
        activeGoalId: goal.id
      };
    }
    newLocationState.displayAddGoal = goal ? goal.id : selectedGoalId;
    navigate("/MyGoals", { state: { ...location.state,
      ...(goal ? {
        goalsHistory: [...subGoalHistory, {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "" },
        ],
        activeGoalId: goal.id }
        : {}),
      displayAddGoal: goal ? goal.id : selectedGoalId
    } });
  };

  const handleUpdateGoal = (id: string) => {
    navigate("/MyGoals", { state: { ...location.state, displayUpdateGoal: id } });
  };

  const handleShareGoal = (id: string) => {
    navigate("/MyGoals", { state: { ...location.state, displayShareModal: id } });
  };

  const handleConfirmation = () => {
    navigate("/MyGoals", { state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } } });
  };

  const handleDisplayChanges = () => {
    navigate("/MyGoals", { state: location.state });
  };

  useEffect(() => {
    handleLocationChange();
  }, [location]);

  return {
    handleAddGoal,
    handleShareGoal,
    handleUpdateGoal,
    handleConfirmation,
    handleDisplayChanges
  };
}

export default useGoalStore;
