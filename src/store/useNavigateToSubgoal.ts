import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";
import { GoalItem } from "@src/models/GoalItem";

const useNavigateToSubgoal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;

  const navigateToSubgoal = (goal: GoalItem | null) => {
    if (!goal) {
      return;
    }
    const newState: ILocationState = {
      ...location.state,
      activeGoalId: goal.id,
      goalsHistory: [
        ...(location.state?.goalsHistory || []),
        {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        },
      ],
    };
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;

    navigate(`${prefix}/${goal.id}`, { state: newState });
  };

  return navigateToSubgoal;
};

export default useNavigateToSubgoal;
