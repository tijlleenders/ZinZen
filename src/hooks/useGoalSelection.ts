import { GoalItem } from "@src/models/GoalItem";
import { useCallback, useEffect, useMemo } from "react";
import { extractLinks } from "@src/utils/patterns";
import { ILocationState } from "@src/Interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { focusedGoalState } from "@src/store/GoalsState";
import { lastAction } from "@src/store";
import { useKeyPress } from "./useKeyPress";

export const useGoalSelection = (goals: GoalItem[]): GoalItem | undefined => {
  const [focusedIndex, setFocusedIndex] = useRecoilState(focusedGoalState);
  const location = useLocation();
  const navigate = useNavigate();

  const action = useRecoilValue(lastAction);

  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");
  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");

  const disableKeyboardNavigation = useMemo(() => {
    return location.search !== "";
  }, [location.search]);

  const handleRightKeyPress = (goal: GoalItem) => {
    if (disableKeyboardNavigation) return;

    const url = extractLinks(goal.title);
    if (url) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
      return;
    }
    const newState: ILocationState = {
      ...location.state,
      foucusedGoalIndex: focusedIndex,
      goalsHistory: [
        ...(location.state?.goalsHistory || []),
        {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        },
      ],
    };
    setFocusedIndex(-1);
    navigate(`/goals/${goal.id}`, { state: newState });
  };

  const handleFocusChange = useCallback(
    (newIndex: number) => {
      if (goals.length === 0) return;
      const adjustedIndex = (newIndex + goals.length) % goals.length;
      setFocusedIndex(adjustedIndex);
      const goalElement = document.getElementById(`goal-${goals[adjustedIndex]?.id}`);
      if (goalElement) {
        goalElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [goals, setFocusedIndex],
  );

  if (focusedIndex !== -1 && action === "goalItemCreated") {
    setFocusedIndex(0);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // handle down key press
  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (downPress) {
      handleFocusChange(focusedIndex + 1);
    }
  }, [downPress, goals.length, handleFocusChange]);

  // handle up key press
  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (upPress) {
      handleFocusChange(focusedIndex - 1);
    }
  }, [upPress, goals.length, handleFocusChange]);

  // handle right key press
  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (rightPress && goals.length > 0 && focusedIndex !== -1) {
      handleRightKeyPress(goals[focusedIndex]);
    }
  }, [rightPress]);

  // handle left key press
  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (leftPress) {
      if (location.pathname === "/goals") {
        return;
      }
      setFocusedIndex(location.state.foucusedGoalIndex === undefined ? -1 : location.state.foucusedGoalIndex);
      window.history.back();
    }
  }, [leftPress]);

  if (goals.length === 0) {
    return undefined;
  }

  return goals[focusedIndex];
};
