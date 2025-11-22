import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { TGoalCategory } from "@src/models/GoalItem";
import { TGoalConfigMode } from "@src/types";
import { allowAddingBudgetGoal } from "@src/store/GoalsState";
import { useKeyPress } from "@src/hooks/useKeyPress";
import FabButton from "./FabButton";
import FabOptionsMenu, { FabOption } from "./FabOptionsMenu";

const MyTimeFab: React.FC = () => {
  const { t } = useTranslation();
  const { type, addOptions } = useSearch({ strict: false }) as {
    type?: TGoalCategory;
    mode?: TGoalConfigMode;
    addOptions?: boolean;
  };

  const navigate = useNavigate();
  const canAddBudgetGoal = useRecoilValue(allowAddingBudgetGoal);

  const handleAddStandardGoal = () => {
    navigate({
      to: "/",
      search: { type: "Standard", mode: "add" },
      state: (state) => ({ ...state }),
      replace: true,
    });
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

  if (addOptions) {
    const options: FabOption[] = [
      {
        label: t("Standard"),
        onClick: handleAddStandardGoal,
      },
    ];

    if (canAddBudgetGoal) {
      options.push({
        label: t("Budget"),
        onClick: handleAddBudgetGoal,
      });
    }

    return <FabOptionsMenu options={options} onClose={handleCloseMenu} />;
  }

  return (
    <FabButton
      icon={<img src={GlobalAddIcon} alt="add goal" />}
      onClick={handleAddStandardGoal}
      onLongPress={handleLongPress}
    />
  );
};

export default MyTimeFab;
