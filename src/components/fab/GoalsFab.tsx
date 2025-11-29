import React, { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import { allowAddingBudgetGoal } from "@src/store/GoalsState";
import { useKeyPress } from "@src/hooks/useKeyPress";
import GlobalFab from "./GlobalFab";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";

const GoalsFab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canAddBudgetGoal = useRecoilValue(allowAddingBudgetGoal);

  const { type, addOptions } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TGoalConfigMode;
    addOptions?: boolean;
  };

  const { parentId = "root" } = useParams({ strict: false }) as {
    parentId: string;
  };

  const handleAddStandardGoal = (replace = false) => {
    navigate({
      to: `/goals/${parentId || "root"}`,
      search: { type: "Standard", mode: "add" },
      state: (state) => ({ ...state }),
      replace,
    });
  };

  const handleAddBudgetGoal = () => {
    navigate({
      to: `/goals/${parentId || "root"}`,
      search: { type: "Budget", mode: "add" },
      state: (state) => ({ ...state }),
      replace: true,
    });
  };

  const handleLongPress = () => {
    navigate({
      to: `/goals/${parentId}`,
      search: { addOptions: true },
      state: (state) => ({ ...state }),
    });
  };

  const handleCloseMenu = () => {
    window.history.back();
  };

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  useEffect(() => {
    if ((plusPressed || enterPressed) && !type) {
      handleAddStandardGoal();
    }
  }, [plusPressed, enterPressed]);

  const handleAddGoalOptionClick = () => {
    handleAddStandardGoal(true);
  };

  const handleGoalFabClick = () => {
    handleAddStandardGoal();
  };

  const options: FabMenuOption[] = useMemo(() => {
    const opts: FabMenuOption[] = [
      {
        label: t("Standard"),
        onClick: handleAddGoalOptionClick,
      },
    ];

    if (canAddBudgetGoal) {
      opts.push({
        label: t("Budget"),
        onClick: handleAddBudgetGoal,
      });
    }

    return opts;
  }, [canAddBudgetGoal, handleAddStandardGoal, handleAddBudgetGoal]);

  return (
    <GlobalFab
      icon={<img src={GlobalAddIcon} alt="add goal" />}
      onClick={handleGoalFabClick}
      onLongPress={handleLongPress}
      showMenu={addOptions ?? false}
      options={options}
      onCloseMenu={handleCloseMenu}
    />
  );
};

export default GoalsFab;
