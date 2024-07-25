import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImpossibleGoal } from "@src/Interfaces";
import React from "react";
import MyGoal from "./MyGoal";

interface SortableItemProps {
  goal: ImpossibleGoal;
}

const SortableItem = ({ goal }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: goal.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none", // Prevents scrolling during drag
  };

  return (
    <div ref={setNodeRef} style={style}>
      <MyGoal goal={goal} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
};

export default SortableItem;
