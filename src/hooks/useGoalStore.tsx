import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { ILocationState } from "@src/Interfaces";
import { moveGoalState } from "@src/store/moveGoalState";

const useGoalStore = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const showConfirmation = useRecoilValue(displayConfirmation);
  const setGoalToMove = useSetRecoilState(moveGoalState);

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

  const handleMove = (goal: GoalItem) => {
    setGoalToMove(goal);
    navigate("/goals", { replace: true });
  };

  return {
    openEditMode,
    handleConfirmation,
    handleDisplayChanges,
    handleMove,
  };
};

export default useGoalStore;
