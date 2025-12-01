import { useKeyPress } from "@src/hooks/useKeyPress";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";

export const useGoalFabActions = () => {
  const navigate = useNavigate();
  const { mode, type } = useSearch({ strict: false }) as { type?: TGoalCategory; mode?: TGoalConfigMode };
  const isModalOpen = mode === "add" && !!type;
  const enterPressedWhenModalOpenRef = useRef(false);

  const showAddGoalModal = (goalType: TGoalCategory, replace = false) => {
    navigate({
      to: ".",
      search: { type: goalType, mode: "add" },
      state: (state) => ({ ...state }),
      replace,
    });
  };

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  useEffect(() => {
    if (isModalOpen && enterPressed) {
      enterPressedWhenModalOpenRef.current = true;
    }

    if (!enterPressed) {
      enterPressedWhenModalOpenRef.current = false;
    }
  }, [isModalOpen, enterPressed]);

  useEffect(() => {
    if (isModalOpen) return;

    if (enterPressed && enterPressedWhenModalOpenRef.current) {
      return;
    }

    const { activeElement } = document;
    const isInputFocused =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT" ||
        (activeElement instanceof HTMLElement && activeElement.isContentEditable));

    if (plusPressed || (enterPressed && !isInputFocused)) {
      showAddGoalModal("Standard");
    }
  }, [plusPressed, enterPressed, isModalOpen]);

  return { showAddGoalModal };
};
