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
import { ImpossibleGoal } from "@src/Interfaces";
import { useGoalSelection } from "@src/hooks/useGoalSelection";
import { useUpdateGoalPositions } from "@src/hooks/api/Goals/mutations/useUpdateGoalPositions";

import SortableItem from "./MyGoal/SortableItem";

interface GoalsListProps {
  goals: GoalItem[];
}

const GoalsList = ({ goals }: GoalsListProps) => {
  const { mutate: updatePositions } = useUpdateGoalPositions();

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
    const isImpossibleFromGoal = goal.impossible === true;

    return {
      ...goal,
      impossible: isImpossibleFromGoal,
    };
  };

  const updatedGoals = goals.map(addImpossibleProp);

  const getGoalsPos = (id: string | number | undefined) => goals.findIndex((goal) => goal.id === id);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const originalPos = getGoalsPos(active.id);
      const newPos = getGoalsPos(over?.id);
      const newItems = arrayMove(goals, originalPos, newPos);
      updatePositions({ goals: newItems });
    }
  };

  const focusedGoal = useGoalSelection(goals);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={updatedGoals.map((goal) => goal.id)} strategy={verticalListSortingStrategy}>
        {updatedGoals.map((goal: ImpossibleGoal) => (
          <div
            key={`sortable-${goal.id}`}
            style={focusedGoal?.id === goal.id ? { borderLeft: `${goal.goalColor} 3px solid` } : {}}
            className={focusedGoal?.id === goal.id ? "focused-goal" : ""}
          >
            <SortableItem key={`sortable-${goal.id}`} goal={goal} />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default GoalsList;
