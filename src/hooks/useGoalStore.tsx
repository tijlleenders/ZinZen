import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { moveGoalState } from "@src/store/moveGoalState";

const useGoalStore = () => {
  const params = useParams({ strict: false }) as { partnerId?: string };
  const navigate = useNavigate();
  const location = useLocation();
  const showConfirmation = useRecoilValue(displayConfirmation);
  const setGoalToMove = useSetRecoilState(moveGoalState);

  const openEditMode = (goal: GoalItem, customState?: Record<string, unknown>) => {
    const newState = { ...location.state, ...customState };

    if (params.partnerId) {
      navigate({
        to: "/partners/$partnerId/goals/$parentId/$activeGoalId",
        params: { partnerId: params.partnerId, parentId: goal.parentGoalId, activeGoalId: goal.id },
        search: { type: goal.category, mode: "edit" },
        state: newState,
        replace: true,
      });
    } else {
      navigate({
        to: "/goals/$parentId/$activeGoalId",
        params: { parentId: goal.parentGoalId, activeGoalId: goal.id },
        search: { type: goal.category, mode: "edit" },
        state: newState,
        replace: true,
      });
    }
  };

  const handleConfirmation = () => {
    navigate({
      to: "/goals/$parentId",
      params: { parentId: "root" },
      state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } },
    });
  };

  const handleDisplayChanges = () => {
    navigate({ to: "/goals/$parentId", params: { parentId: "root" }, state: location.state });
  };

  const handleMove = (goal: GoalItem) => {
    setGoalToMove(goal);
    navigate({ to: "/goals/$parentId", params: { parentId: "root" }, replace: true });
  };

  return { openEditMode, handleConfirmation, handleDisplayChanges, handleMove };
};

export default useGoalStore;
