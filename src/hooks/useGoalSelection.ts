import { GoalItem } from "@src/models/GoalItem";
import { useCallback, useEffect, useMemo } from "react";
import { extractLinks } from "@src/utils/patterns";
import { ILocationState } from "@src/Interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { focusedGoalState } from "@src/store/GoalsState";
import { useKeyPress } from "./useKeyPress";

export const useGoalSelection = (goals: GoalItem[]): GoalItem | undefined => {
  const [focusedIndex, setFocusedIndex] = useRecoilState(focusedGoalState);
  const location = useLocation();
  const navigate = useNavigate();

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
      activeGoalId: goal.id,
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

  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");
  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");

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

  const scrollIntoView = useCallback(
    (index: number) => {
      const goalElement = document.getElementById(`goal-${goals[index]?.id}`);
      if (goalElement) {
        goalElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [goals],
  );

  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (downPress) {
      setFocusedIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % goals.length;
        scrollIntoView(newIndex);
        return newIndex;
      });
    }
  }, [downPress, goals.length, scrollIntoView]);

  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (upPress) {
      setFocusedIndex((prevIndex) => {
        const newIndex = (prevIndex - 1 + goals.length) % goals.length;
        scrollIntoView(newIndex);
        return newIndex;
      });
    }
  }, [upPress, goals.length, scrollIntoView]);

  useEffect(() => {
    if (disableKeyboardNavigation) return;

    if (rightPress && goals.length > 0 && focusedIndex !== -1) {
      handleRightKeyPress(goals[focusedIndex]);
    }
  }, [rightPress]);

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
