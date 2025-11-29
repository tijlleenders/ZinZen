import { useKeyPress } from "@src/hooks/useKeyPress";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import { useTranslation } from "react-i18next";

export const useGoalFabActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { type, addOptions } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TGoalConfigMode;
    addOptions?: boolean;
  };

  const showMenu = addOptions ?? false;

  const handleAddStandardGoal = (replace = false) => {
    navigate({
      to: "/",
      search: { type: "Standard", mode: "add" },
      state: (state) => ({ ...state }),
      replace,
    });
  };

  const handleGlobalAddClick = () => {
    handleAddStandardGoal();
  };

  const handleAddGoalOptionClick = () => {
    handleAddStandardGoal(true);
  };

  const handleAddBudgetGoal = () => {
    navigate({
      to: "/",
      search: { type: "Budget", mode: "add" },
      state: (state) => ({ ...state }),
      replace: true,
    });
  };

  const handleLongPress = () => {
    navigate({
      to: "/",
      search: { addOptions: true },
      state: (state) => ({ ...state }),
    });
  };

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  useEffect(() => {
    if ((plusPressed || enterPressed) && !type) {
      handleAddStandardGoal();
    }
  }, [plusPressed, enterPressed]);

  const goalFabMenuOptions: FabMenuOption[] = useMemo(() => {
    return [
      {
        label: t("Budget"),
        onClick: handleAddBudgetGoal,
      },
      {
        label: t("Goal"),
        onClick: handleAddGoalOptionClick,
      },
    ];
  }, [handleAddStandardGoal, handleAddBudgetGoal]);

  return { handleGlobalAddClick, goalFabMenuOptions, showMenu, handleLongPress };
};
