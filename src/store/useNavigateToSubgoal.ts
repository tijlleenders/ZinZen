import { useNavigate, useLocation, useParams } from "@tanstack/react-router";
import { GoalItem } from "@src/models/GoalItem";

const useNavigateToSubgoal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = useParams({ strict: false }) as { partnerId?: string };
  const isPartnerModeActive = !!params.partnerId;

  const navigateToSubgoal = (goal: GoalItem | null) => {
    if (!goal) {
      return;
    }
    const newState = {
      ...location.state,
      activeGoalId: goal.id,
      goalsHistory: [
        ...(location.state?.goalsHistory || []),
        { goalID: goal.id || "root", goalColor: goal.goalColor || "#ffffff", goalTitle: goal.title || "" },
      ],
    };

    if (isPartnerModeActive) {
      navigate({
        to: "/partners/$partnerId/goals/$parentId",
        params: { partnerId: params.partnerId!, parentId: goal.id },
        state: newState,
        replace: true,
      });
    } else {
      navigate({ to: "/goals/$parentId", params: { parentId: goal.id }, state: newState, replace: true });
    }
  };

  return navigateToSubgoal;
};

export default useNavigateToSubgoal;
