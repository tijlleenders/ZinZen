import { GoalItem } from "@src/models/GoalItem";
import { useEffect, useState } from "react";
import { useKeyPress } from "./useKeyPress";
import { extractLinks } from "@src/utils/patterns";
import { ILocationState } from "@src/Interfaces";
import { useLocation, useNavigate } from "react-router-dom";

export const useGoalSelection = (
  goals: GoalItem[],
  handleRightNavigation: (langId: string) => void,
): [number, GoalItem] => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = (goal: GoalItem, state: object) => {
    const prefix = `${"/"}goals`;
    navigate(`${prefix}/${goal.id}`, { state });
  };

  console.log("focusedIndex", focusedIndex);

  const handleGoalClick = (goal: GoalItem) => {
    if (goal === undefined) return;
    const url = extractLinks(goal?.title);
    if (url) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
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
    redirect(goal, newState);
  };

  const handleRight = (goal: GoalItem) => {
    handleGoalClick(goal);
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
    if (rightPress) {
      handleRight(goals[focusedIndex]);
    }
  }, [rightPress]);

  useEffect(() => {
    if (leftPress) {
      window.history.back();
    }
  }, [leftPress]);

  return [focusedIndex, goals[focusedIndex]];
};
