import { updatePositionIndex } from "@src/api/GCustomAPI";
import { GoalItem } from "@src/models/GoalItem";
import React, { useState } from "react";
import { displayUpdateGoal, displayGoalActions } from "@src/store/GoalsState";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRecoilValue } from "recoil";
import { impossibleGoalsList } from "@src/store/ImpossibleGoalState";
import { ImpossibleGoal } from "@src/Interfaces";

import RegularGoalActions from "./MyGoalActions/RegularGoalActions";
import SortableItem from "./MyGoal/SortableItem";

interface GoalsListProps {
  goals: GoalItem[];
  setGoals: React.Dispatch<React.SetStateAction<GoalItem[]>>;
}

const GoalsList = ({ goals, setGoals }: GoalsListProps) => {
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const impossibleGoals = useRecoilValue(impossibleGoalsList);
  const [dragging, setDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<GoalItem | null>(null);
  const showGoalActions = useRecoilValue(displayGoalActions);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 10,
      },
    }),
  );

  const addImpossibleProp = (goal: GoalItem): ImpossibleGoal => {
    const isImpossibleGoal = impossibleGoals.some((impossibleGoal) => goal.id === impossibleGoal.goalId);

    const isImpossibleSublistGoal =
      !isImpossibleGoal &&
      goal.sublist.some((sublistGoal) =>
        impossibleGoals.some((impossibleSublistGoal) => impossibleSublistGoal.goalId === sublistGoal),
      );

    return {
      ...goal,
      impossible: isImpossibleGoal || isImpossibleSublistGoal,
    };
  };

  const updatedGoals = goals.map(addImpossibleProp);

  const getGoalsPos = (id: string | number | undefined) => goals.findIndex((goal) => goal.id === id);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setGoals((items) => {
        const originalPos = getGoalsPos(active.id);
        const newPos = getGoalsPos(over?.id);
        const newItems = arrayMove(items, originalPos, newPos);
        const posIndexPromises = newItems.map(async (ele, index) => updatePositionIndex(ele.id, index));
        Promise.all(posIndexPromises).catch((err) => console.log("error in sorting", err));
        return newItems;
      });
    }
  };

  return (
    <>
      {showGoalActions && showGoalActions.actionType === "regular" && (
        <RegularGoalActions open goal={showGoalActions.goal} />
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={updatedGoals.map((goal) => goal.id)} strategy={verticalListSortingStrategy}>
          {updatedGoals.map((goal: ImpossibleGoal, index: number) => (
            <React.Fragment key={goal.id}>
              <SortableItem key={goal.id} goal={goal} index={index} />
            </React.Fragment>
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default GoalsList;
