import { GoalItem } from "@src/models/GoalItem";
import { useEffect, useState } from "react";
import { extractLinks } from "@src/utils/patterns";
import { ILocationState } from "@src/Interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeyPress } from "./useKeyPress";

export const useGoalSelection = (goals: GoalItem[]): GoalItem => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRightKeyPress = (goal: GoalItem) => {
    const url = extractLinks(goal.title);
    if (url) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
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
    navigate(`/goals/${goal.id}`, { state: newState });
  };

  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");
  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");

  useEffect(() => {
    if (downPress) {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % goals.length);
    }
  }, [downPress, goals.length]);

  useEffect(() => {
    if (upPress) {
      setFocusedIndex((prevIndex) => (prevIndex - 1 + goals.length) % goals.length);
    }
  }, [upPress, goals.length]);

  useEffect(() => {
    if (rightPress && goals.length > 0) {
      handleRightKeyPress(goals[focusedIndex]);
    }
  }, [rightPress]);

  useEffect(() => {
    if (leftPress) {
      if (window.location.pathname === "/goals") {
        return;
      }
      window.history.back();
    }
  }, [leftPress]);

  if (goals.length === 0) {
    return undefined;
  }

  return goals[focusedIndex];
};
