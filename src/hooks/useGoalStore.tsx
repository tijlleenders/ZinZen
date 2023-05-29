import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { displayAddGoal, displayGoalId, displayUpdateGoal, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";
import { colorPalleteList } from "@src/utils";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

function useGoalStore() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);

  const setColorIndex = useSetRecoilState(selectedColorIndex);

  const handleNativeClick = () => {
    const locationState = location.state || {};
    if (showAddGoal || "displayAddGoal" in locationState) {
      setShowAddGoal(showAddGoal ? null : { open: true, goalId: locationState.displayAddGoal });
    } else if (showUpdateGoal || "displayUpdateGoal" in locationState) {
      setShowUpdateGoal(showUpdateGoal ? null : { open: true, goalId: locationState.displayUpdateGoal });
    }
    if (subGoalHistory.length > 0 ||
      ("goalsHistory" in locationState && "activeGoalId" in locationState)) {
      setSubGoalHistory([...(locationState.goalsHistory || [])]);
      setSelectedGoalId(locationState.activeGoalId || "root");
    }
  };

  const handleAddGoal = async (goal: GoalItem | null = null) => {
    if (selectedGoalId === "root") {
      setColorIndex(Math.floor((Math.random() * colorPalleteList.length) + 1));
    } else if (goal) {
      setColorIndex(colorPalleteList.indexOf(goal.goalColor));
    } else {
      await getGoal(selectedGoalId).then((fetchedGoal) => { if (fetchedGoal) setColorIndex(colorPalleteList.indexOf(fetchedGoal.goalColor)); });
    }
    navigate("/MyGoals", { state: {
      ...(goal ? {
        goalsHistory: [...subGoalHistory, {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "" }
        ] }
        : {}),
      displayAddGoal: goal ? goal.id : selectedGoalId
    } });
  };

  const handleUpdateGoal = (id: string) => {
    navigate("/MyGoals", { state: { displayUpdateGoal: id } });
  };

  useEffect(() => {
    handleNativeClick();
  }, [location]);

  return {
    handleAddGoal,
    handleUpdateGoal
  };
}

export default useGoalStore;
