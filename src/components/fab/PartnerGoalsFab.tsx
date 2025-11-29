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
import { useFabMenu } from "./FabOptionsMenu/useFabMenu.ts";

const PartnerGoalsFab: React.FC = () => {
  const { t } = useTranslation();
  const { type } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TGoalConfigMode;
    addOptions?: boolean;
  };

  const { parentId = "root", partnerId } = useParams({ strict: false }) as {
    parentId: string;
    partnerId: string;
  };

  const { openMenu, open } = useFabMenu();

  const navigate = useNavigate();
  const canAddBudgetGoal = useRecoilValue(allowAddingBudgetGoal);

  const handleAddStandardGoal = () => {
    navigate({
      to: `/partners/${partnerId}/goals/${parentId || "root"}`,
      search: { type: "Standard", mode: "add" },
      state: (state) => ({ ...state }),
      replace: false,
    });
  };

  const handleAddBudgetGoal = () => {
    navigate({
      to: `/partners/${partnerId}/goals/${parentId || "root"}`,
      search: { type: "Budget", mode: "add" },
      state: (state) => ({ ...state }),
      replace: false,
    });
  };

  const enterPressed = useKeyPress("Enter");
  const plusPressed = useKeyPress("+");

  useEffect(() => {
    if ((plusPressed || enterPressed) && !type) {
      handleAddStandardGoal();
    }
  }, [plusPressed, enterPressed]);

  const options: FabMenuOption[] = useMemo(() => {
    const opts: FabMenuOption[] = [
      {
        label: t("Standard"),
        onClick: handleAddStandardGoal,
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
      onClick={handleAddStandardGoal}
      menu={{
        show: open,
        onLongPress: openMenu,
        options,
      }}
    />
  );
};

export default PartnerGoalsFab;
