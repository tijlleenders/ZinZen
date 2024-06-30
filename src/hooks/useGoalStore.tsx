import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ILocationState } from "@src/Interfaces";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { displayGoalId, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";
import { colorPalleteList } from "@src/utils";
import { moveGoalState } from "@src/store/moveGoalState";

const useGoalStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);

  const setGoalToMove = useSetRecoilState(moveGoalState);
  const setColorIndex = useSetRecoilState(selectedColorIndex);

  const handleAddGoal = async (type: "Budget" | "Goal", goal: GoalItem | null = null) => {
    let newLocationState: ILocationState = { ...location.state, displayAddGoal: selectedGoalId };
    delete newLocationState.displayAddGoalOptions;
    if (selectedGoalId === "root") {
      setColorIndex(Math.floor(Math.random() * colorPalleteList.length));
    } else if (goal) {
      setColorIndex(colorPalleteList.indexOf(goal.goalColor));
    } else {
      await getGoal(selectedGoalId).then((fetchedGoal) => {
        if (fetchedGoal) setColorIndex(colorPalleteList.indexOf(fetchedGoal.goalColor));
      });
    }
    if (goal) {
      newLocationState = {
        goalsHistory: [
          ...subGoalHistory,
          {
            goalID: goal.id || "root",
            goalColor: goal.goalColor || "#ffffff",
            goalTitle: goal.title || "",
          },
        ],
        activeGoalId: goal.id,
      };
    }
    newLocationState.displayAddGoal = goal ? goal.id : selectedGoalId;
    navigate("/MyGoals", {
      state: {
        ...newLocationState,
        goalType: type,
      },
      replace: true,
    });
  };

  const handleUpdateGoal = (id: string, isBudget: boolean) => {
    const newLocationState: ILocationState = { ...location.state };
    delete newLocationState.displayGoalActions;
    navigate("/MyGoals", {
      state: { ...newLocationState, displayUpdateGoal: id, goalType: isBudget ? "Budget" : "Goal" },
      replace: true,
    });
  };

  const handleShareGoal = (goal: GoalItem) => {
    navigate("/MyGoals", { state: { ...location.state, displayShareModal: goal } });
  };

  const handleConfirmation = () => {
    navigate("/MyGoals", { state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } } });
  };

  const handleDisplayChanges = () => {
    navigate("/MyGoals", { state: location.state });
  };
  const handleGoalActions = (id: string) => {
    navigate("/MyGoals", { state: { ...location.state, showGoalActions: id } });
  };

  const handleMove = (goal: GoalItem) => {
    setGoalToMove(goal);
    navigate("/MyGoals", { state: { ...location.state, displayGoalActions: null } });
  };

  return {
    handleAddGoal,
    handleShareGoal,
    handleUpdateGoal,
    handleGoalActions,
    handleConfirmation,
    handleDisplayChanges,
    handleMove,
  };
};

export default useGoalStore;
