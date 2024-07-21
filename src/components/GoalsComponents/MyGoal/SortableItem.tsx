import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImpossibleGoal } from "@src/Interfaces";
import React from "react";
import MyGoal from "./MyGoal";

interface SortableItemProps {
  goal: ImpossibleGoal;
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

const SortableItem = ({ goal, showActions, setShowActions }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: goal.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <MyGoal
        goal={goal}
        actionType="regular"
        showActions={showActions}
        setShowActions={setShowActions}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
    </div>
  );
};

export default SortableItem;
