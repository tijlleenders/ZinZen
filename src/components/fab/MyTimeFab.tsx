import React, { useMemo } from "react";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import GlobalFab from "./GlobalFab";
import { useGoalFabActions } from "./GoalFabMenuOptions";
import { useFabMenu } from "./FabOptionsMenu/useFabMenu";
import { FabMenuOption } from "./FabOptionsMenu/FabOptionsMenu.types";

const MyTimeFab: React.FC = () => {
  const { showAddGoalModal } = useGoalFabActions();
  const { openMenu, open } = useFabMenu();

  const goalFabMenuOptions: FabMenuOption[] = useMemo(() => {
    return [
      {
        label: "Budget",
        onClick: () => showAddGoalModal("Budget", true),
      },
      {
        label: "Goal",
        onClick: () => showAddGoalModal("Standard", true),
      },
    ];
  }, [showAddGoalModal]);

  return (
    <GlobalFab
      icon={<img src={GlobalAddIcon} alt="add goal" />}
      onClick={() => showAddGoalModal("Standard")}
      menu={{
        show: open,
        onLongPress: openMenu,
        options: goalFabMenuOptions,
      }}
    />
  );
};

export default MyTimeFab;
