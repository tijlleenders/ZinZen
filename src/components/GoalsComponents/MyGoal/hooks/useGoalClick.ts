import { useLocation, useNavigate, useParams } from "@tanstack/react-router";
import { ILocationState } from "@src/Interfaces";
import { GoalItem } from "@src/models/GoalItem";
import { isGoalCode } from "@src/utils/patterns";
import { useCopyCode } from "./useCopyCode";

export const useGoalClick = (goal: GoalItem) => {
  const { partnerId } = useParams({ strict: false });
  const isPartnerModeActive = !!partnerId;
  const navigate = useNavigate();
  const location = useLocation();
  const copyCode = useCopyCode();

  const redirect = (state: object) => {
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    navigate({ to: `${prefix}/${goal.id}`, state });
  };

  const handleGoalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (isGoalCode(goal.title)) {
      copyCode(goal.title);
      return;
    }

    const newState: ILocationState = {
      ...location.state,
      goalsHistory: [
        ...(location.state?.goalsHistory || []),
        {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        },
      ],
    };
    redirect(newState);
  };

  return { handleGoalClick };
};
