import { GoalItem } from "@src/models/GoalItem";
import { useEffect, useState } from "react";
import { useKeyPress } from "./useKeyPress";

export const useGoalSelection = (goals: GoalItem[], handleClick: (langId: string) => void): number => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");
  const rightPress = useKeyPress("ArrowRight");
  const leftPress = useKeyPress("ArrowLeft");

  useEffect(() => {
    if (downPress) {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % goals.length);
    }
  }, [downPress]);

  useEffect(() => {
    if (upPress) {
      setFocusedIndex((prevIndex) => (prevIndex - 1 + goals.length) % goals.length);
    }
  }, [upPress]);

  return focusedIndex;
};
