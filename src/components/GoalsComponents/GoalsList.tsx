import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import React from "react";
import { displayGoalActions, displayUpdateGoal } from "@src/store/GoalsState";
import { useRecoilValue } from "recoil";
import { impossibleGoalsList } from "@src/store/ImpossibleGoalState";
import { GoalItem } from "@src/models/GoalItem";
import { ImpossibleGoal } from "@src/Interfaces";
import ConfigGoal from "./GoalConfigModal/ConfigGoal";
import MyGoal from "./MyGoal/MyGoal";
import RegularGoalActions from "./MyGoalActions/RegularGoalActions";

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

const GoalsList = ({ goals, showActions, setGoals, setShowActions }: GoalsListProps) => {
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showGoalActions = useRecoilValue(displayGoalActions);
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

  //helper function for getting item position

  const getGoalsPos = (id: string | number | undefined) => goals.findIndex((goal) => goal.id === id);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setGoals((items) => {
        const originalPos = getGoalsPos(active.id);
        const newPos = getGoalsPos(over?.id);
        return arrayMove(items, originalPos, newPos);
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
              {showUpdateGoal?.goalId === goal.id && <ConfigGoal action="Update" goal={goal} />}
              <SortableItem
                key={goal.id}
                goal={goal}
                index={index}
                showActions={showActions}
                setShowActions={setShowActions}
              />
            </React.Fragment>
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default GoalsList;

interface SortableItemProps {
  goal: ImpossibleGoal;
  index: number;
  showActions: {
    open: string;
    click: number;
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
    }>
  >;
}

const SortableItem = ({ goal, index, showActions, setShowActions }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: goal.id });

  // Constrain transform to only affect the vertical axis
  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    touchAction: "none", // Prevents scrolling during drag
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MyGoal actionType="regular" goal={goal} showActions={showActions} setShowActions={setShowActions} />
    </div>
  );
};
