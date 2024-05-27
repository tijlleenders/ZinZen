import { useNavigate, useLocation } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";
import { GoalItem } from "@src/models/GoalItem";
import { useRecoilValue } from "recoil";
import { goalsHistory } from "./GoalsState";

const useNavigateToSubgoal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const subGoalHistory = useRecoilValue(goalsHistory);

  const navigateToSubgoal = (goal: GoalItem | null) => {
    const newState: ILocationState = {
      ...location.state,
      activeGoalId: goal?.id,
      goalsHistory: [
        ...subGoalHistory,
        {
          goalID: goal?.id || "root",
          goalColor: goal?.goalColor || "#ffffff",
          goalTitle: goal?.title || "",
        },
      ],
    };

    if (newState.allowAddingBudgetGoal !== false) {
      newState.allowAddingBudgetGoal = goal?.category !== "Standard";
    }

    navigate("/MyGoals", {
      state: newState,
    });
  };

  return navigateToSubgoal;
};

export default useNavigateToSubgoal;
