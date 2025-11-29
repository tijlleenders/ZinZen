import React from "react";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import GlobalFab from "./GlobalFab";
import { useGoalFabActions } from "./GoalFabMenuOptions";
import { useGoalNavigation } from "./useGoalNavigation";
import { useFabMenu } from "./FabOptionsMenu/useFabMenu";

const MyTimeFab: React.FC = () => {
  const { goalFabMenuOptions } = useGoalFabActions();
  const { openMenu, open } = useFabMenu();

  const { addStandard } = useGoalNavigation("/");
  return (
    <GlobalFab
      icon={<img src={GlobalAddIcon} alt="add goal" />}
      onClick={addStandard}
      menu={{
        show: open,
        onLongPress: openMenu,
        options: goalFabMenuOptions,
      }}
    />
  );
};

export default MyTimeFab;
