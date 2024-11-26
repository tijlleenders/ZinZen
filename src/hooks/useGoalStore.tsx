import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { ILocationState } from "@src/Interfaces";

const useGoalStore = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const showConfirmation = useRecoilValue(displayConfirmation);

  const openEditMode = (goal: GoalItem, customState?: ILocationState) => {
    const prefix = `${partnerId ? `/partners/${partnerId}/` : "/"}goals`;

    navigate(`${prefix}/${goal.parentGoalId}/${goal.id}?type=${goal.category}&mode=edit`, {
      state: {
        ...location.state,
        goalType: goal.category === "Budget" ? "Budget" : "Goal",
        ...customState,
      },
      replace: true,
    });
  };

  const handleConfirmation = () => {
    navigate("/goals", { state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } } });
  };

  const handleDisplayChanges = () => {
    navigate("/goals", { state: location.state });
  };

  return {
    openEditMode,
    handleConfirmation,
    handleDisplayChanges,
  };
};

export default useGoalStore;
