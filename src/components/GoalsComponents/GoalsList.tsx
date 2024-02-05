import { updatePositionIndex } from "@src/api/GCustomAPI";
import DragAndDrop from "@src/layouts/DragAndDrop";
import { GoalItem } from "@src/models/GoalItem";
import React, { useState } from "react";
import { displayUpdateGoal } from "@src/store/GoalsState";
import { useRecoilValue } from "recoil";
import ConfigGoal from "./GoalConfigModal/ConfigGoal";
import MyGoal from "./MyGoal/MyGoal";

interface GoalsListProps {
  goals: GoalItem[];
  showActions: {
    open: string;
    click: number;
  };
  setGoals: React.Dispatch<React.SetStateAction<GoalItem[]>>;
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
    }>
  >;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, showActions, setGoals, setShowActions }) => {
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const [dragging, setDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<GoalItem | null>(null);

  const handleDragStart = (e, index: number) => {
    setDragging(true);
    setDraggedItem(goals[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedItem !== null) {
      const newItems = [...goals];
      newItems.splice(index, 0, newItems.splice(goals.indexOf(draggedItem), 1)[0]);
      setGoals(newItems);
    }
  };

  const handleDragEnd = async () => {
    setDragging(false);
    setDraggedItem(null);
    const posIndexPromises = goals.map(async (ele, index) => updatePositionIndex(ele.id, index));
    Promise.all(posIndexPromises).catch((err) => console.log("error in sorting", err));
  };
  return goals.map((goal: GoalItem, index: number) => (
    <React.Fragment key={goal.id}>
      {showUpdateGoal?.goalId === goal.id && <ConfigGoal action="Update" goal={goal} />}
      <DragAndDrop
        thisItem={goal.id === draggedItem?.id}
        index={index}
        dragging={dragging}
        handleDragStart={handleDragStart}
        handleDragEnter={handleDragEnter}
        handleDragEnd={handleDragEnd}
      >
        <MyGoal goal={goal} showActions={showActions} setShowActions={setShowActions} />
      </DragAndDrop>
    </React.Fragment>
  ));
};

export default GoalsList;
