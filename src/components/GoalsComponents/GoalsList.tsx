import { updatePositionIndex } from "@src/api/GCustomAPI";
import { GoalItem } from "@src/models/GoalItem";
import React from "react";
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

import { useGoalSelection } from "@src/hooks/useGoalSelection";
import SortableItem from "./MyGoal/SortableItem";
import "./GoalsList.scss";

interface GoalsListProps {
  goals: GoalItem[];
  setGoals: React.Dispatch<React.SetStateAction<GoalItem[]>>;
}

const GoalsList = ({ goals, setGoals }: GoalsListProps) => {
  const impossibleGoals = useRecoilValue(impossibleGoalsList);

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

  const handleGoalSelect = () => {};

  const [focusedIndex, focusedGoal] = useGoalSelection(goals, handleGoalSelect);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={updatedGoals.map((goal) => goal.id)} strategy={verticalListSortingStrategy}>
        {updatedGoals.map((goal: ImpossibleGoal, index: number) => (
          <div
            key={`sortable-${goal.id}`}
            className={`sortable-${goal.id} ${focusedGoal.id === goal.id ? "focused" : ""}`}
          >
            <SortableItem key={`sortable-${goal.id}`} goal={goal} />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default GoalsList;
