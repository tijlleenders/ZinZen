import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";

const useGoalStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showConfirmation = useRecoilValue(displayConfirmation);

  const openEditMode = (goal: GoalItem) => {
    navigate(`/MyGoals/${goal.parentGoalId}/${goal.id}?type=${goal.category}&mode=edit`, {
      state: {
        ...location.state,
        goalType: goal.category === "Budget" ? "Budget" : "Goal",
      },
      replace: true,
    });
  };

  const handleConfirmation = () => {
    navigate("/MyGoals", { state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } } });
  };

  const handleDisplayChanges = () => {
    navigate("/MyGoals", { state: location.state });
  };

  return {
    openEditMode,
    handleConfirmation,
    handleDisplayChanges,
  };
};

export default useGoalStore;
