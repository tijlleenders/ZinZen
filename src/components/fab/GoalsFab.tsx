import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { allowAddingBudgetGoal } from "@src/store/GoalsState";
import GlobalFab from "./GlobalFab";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";
import { useFabMenu } from "./FabOptionsMenu/useFabMenu";
import { useGoalFabActions } from "./GoalFabMenuOptions";

const GoalsFab: React.FC = () => {
  const canAddBudgetGoal = useRecoilValue(allowAddingBudgetGoal);
  const { openMenu, open } = useFabMenu();
  const { showAddGoalModal } = useGoalFabActions();

  const options: FabMenuOption[] = useMemo(() => {
    const opts: FabMenuOption[] = [];

    if (canAddBudgetGoal) {
      opts.push({
        label: "Budget",
        onClick: () => showAddGoalModal("Budget", true),
      });
    }

    opts.push({
      label: "Goal",
      onClick: () => showAddGoalModal("Standard", true),
    });

    return opts;
  }, [canAddBudgetGoal, showAddGoalModal]);

  return (
    <GlobalFab
      icon={<img src={GlobalAddIcon} alt="add goal" />}
      onClick={() => showAddGoalModal("Standard")}
      menu={{
        show: open,
        onLongPress: openMenu,
        options,
      }}
    />
  );
};

export default GoalsFab;
