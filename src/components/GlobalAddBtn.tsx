import React from "react";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import { displayAddGoal, displayGoalId, selectedColorIndex } from "@src/store/GoalsState";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getGoal } from "@src/api/GoalsAPI";
import { colorPalleteList } from "@src/utils";
import { lastAction } from "@src/store";
import { displayAddPublicGroup, displayExploreGroups } from "@src/store/GroupsState";
import { displayAddFeeling } from "@src/store/FeelingsState";

const GlobalAddBtn = ({ add }: { add: string }) => {
  const selectedGoalId = useRecoilValue(displayGoalId);

  const setLastAction = useSetRecoilState(lastAction);
  const setColorIndex = useSetRecoilState(selectedColorIndex);
  const setShowAddGoal = useSetRecoilState(displayAddGoal);
  const setOpenExploreGroups = useSetRecoilState(displayExploreGroups);
  const setShowAddFeelingsModal = useSetRecoilState(displayAddFeeling);

  const [openAddGroup, setOpenAddGroup] = useRecoilState(displayAddPublicGroup);
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (add === "My Goals") {
      if (selectedGoalId === "root") {
        setColorIndex(Math.floor((Math.random() * colorPalleteList.length) + 1));
      } else {
        await getGoal(selectedGoalId).then((goal) => { if (goal) setColorIndex(colorPalleteList.indexOf(goal.goalColor)); });
      }
      setShowAddGoal({ open: true, goalId: selectedGoalId });
    } else if (add === "My Groups") {
      if (openAddGroup) {
        setLastAction("groupadded");
      } else {
        setOpenExploreGroups(false);
        setOpenAddGroup(true);
      }
    } else if (add === "My Journal") {
      setShowAddFeelingsModal(true);
    }
  };
  return (
    <button
      type="button"
      id="global-addBtn"
      onClick={(e) => { handleClick(e); }}
      style={{
        position: "fixed",
        borderRadius: "50%",
        border: "none",
        background: "var(--primary-background)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        width: 56,
        height: 56,
        right: 34,
        bottom: 74
      }}
    > <img className="global-addBtn-img" src={GlobalAddIcon} alt="add goal | add feeling | add group" />
    </button>
  );
};

export default GlobalAddBtn;
