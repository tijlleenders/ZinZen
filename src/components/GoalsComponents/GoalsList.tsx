import { GoalItem } from "@src/models/GoalItem";
import React, { useCallback, useMemo } from "react";
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
import { useUpdateGoalPositions } from "@src/hooks/api/Goals/mutations/useUpdateGoalPositions";
import { POINTER_SENSOR_CONFIG, TOUCH_SENSOR_CONFIG } from "@src/constants/dndConfig";
import GoalItemWrapper from "./GoalItemWrapper";

interface GoalsListProps {
  goals: GoalItem[];
}

const addImpossibleProp = (goal: GoalItem): ImpossibleGoal => {
  const isImpossibleFromGoal = goal.impossible === true;

  return {
    ...goal,
    impossible: isImpossibleFromGoal,
  };
};

const GoalsList = ({ goals }: GoalsListProps) => {
  const { mutate: updatePositions } = useUpdateGoalPositions();
  const sensors = useSensors(
    useSensor(PointerSensor, POINTER_SENSOR_CONFIG),
    useSensor(TouchSensor, TOUCH_SENSOR_CONFIG),
  );

  const updatedGoals = useMemo(() => goals.map(addImpossibleProp), [goals]);

  const itemIds = useMemo(() => updatedGoals.map((goal) => goal.id), [updatedGoals]);

  const getGoalsPos = useCallback(
    (id: string | number | undefined) => goals.findIndex((goal) => goal.id === id),
    [goals],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const originalPos = getGoalsPos(active.id);
        const newPos = getGoalsPos(over?.id);
        const newItems = arrayMove(goals, originalPos, newPos);
        updatePositions({ goals: newItems });
      }
    },
    [goals, getGoalsPos, updatePositions],
  );

  return (
    <div className="d-flex f-col">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {updatedGoals.map((goal: ImpossibleGoal, index: number) => (
            <GoalItemWrapper key={`goal-wrapper-${goal.id}`} goal={goal} index={index} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default GoalsList;
