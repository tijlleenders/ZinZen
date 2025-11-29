import { useKeyPress } from "@src/hooks/useKeyPress";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { TGoalCategory } from "@src/models/GoalItem";

export const useGoalFabActions = () => {
  const navigate = useNavigate();

  const showAddGoalModal = (type: TGoalCategory, replace = false) => {
    navigate({
      to: ".",
      search: { type, mode: "add" },
      state: (state) => ({ ...state }),
      replace,
    });
  };

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  useEffect(() => {
    if (plusPressed || enterPressed) {
      showAddGoalModal("Standard");
    }
  }, [plusPressed, enterPressed]);

  return { showAddGoalModal };
};
