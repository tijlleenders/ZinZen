import { GoalItem } from "@src/models/GoalItem";
import { useCallback, useEffect } from "react";
import { extractLinks } from "@src/utils/patterns";
import { ILocationState } from "@src/Interfaces";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useKeyPress } from "./useKeyPress";

export const useGoalSelection = (goals: GoalItem[]): GoalItem | undefined => {
  const [searchParams, setSeachParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");
  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");
  const spacePress = useKeyPress(" ");

  const focusIndex = Number(searchParams.get("focus") || -1);

  const handleRightKeyPress = (goal: GoalItem) => {
    if (!goal) return;
    const url = extractLinks(goal.title);
    if (url) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
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
    navigate(`/goals/${goal.id}`, { state: newState });
  };

  const handleFocusChange = useCallback(
    (newIndex: number) => {
      if (goals.length === 0) return;
      const adjustedIndex = (newIndex + goals.length) % goals.length;
      setSeachParams(
        {
          focus: adjustedIndex.toString(),
        },
        {
          replace: true,
          state: {
            ...location.state,
          },
        },
      );
      const goalElement = document.getElementById(`goal-${goals[adjustedIndex]?.id}`);
      if (goalElement) {
        goalElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [goals],
  );

  const openGoalActionsModal = (goal: GoalItem) => {
    if (!goal) return;
    if (goal.parentGoalId === "root") {
      navigate(`/goals/root/${goal.id}?showOptions=true`);
    } else {
      navigate(`/goals/${goal.parentGoalId}/${goal.id}?showOptions=true`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (downPress) {
      handleFocusChange(focusIndex + 1);
    }

    if (upPress) {
      handleFocusChange(focusIndex - 1);
    }

    if (rightPress && goals.length > 0) {
      handleRightKeyPress(goals[focusIndex]);
    }

    if (leftPress) {
      if (location.pathname === "/goals") {
        return;
      }
      window.history.back();
    }

    if (spacePress && goals.length > 0) {
      openGoalActionsModal(goals[focusIndex]);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [downPress, upPress, rightPress, leftPress, spacePress]);

  return goals[focusIndex];
};
