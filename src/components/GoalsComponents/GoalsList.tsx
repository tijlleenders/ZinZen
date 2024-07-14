import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { displayGoalActions, displayUpdateGoal } from "@src/store/GoalsState";
import { useRecoilValue } from "recoil";
import { impossibleGoalsList } from "@src/store/ImpossibleGoalState";
import { updatePositionIndex } from "@src/api/GCustomAPI";
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

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
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
        <SortableContext items={updatedGoals.map((goal) => goal.id)} strategy={rectSortingStrategy}>
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
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MyGoal actionType="regular" goal={goal} showActions={showActions} setShowActions={setShowActions} />
    </div>
  );
};
