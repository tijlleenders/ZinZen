import React from "react";
import { useSearch } from "@tanstack/react-router";
import { ImpossibleGoal } from "@src/Interfaces";
import SortableItem from "./MyGoal/SortableItem";

interface GoalItemWrapperProps {
  goal: ImpossibleGoal;
  index: number;
}

const GoalItemWrapper = ({ goal, index }: GoalItemWrapperProps) => {
  const search = useSearch({ strict: false }) as { focus?: string; showOptions?: string };
  const focusIndex = Number(search.focus ?? -1);
  const isFocused = focusIndex === index;

  return (
    <div
      key={`sortable-${goal.id}`}
      style={isFocused ? { borderLeft: `${goal.goalColor} 3px solid` } : {}}
      className={isFocused ? "focused-goal" : ""}
    >
      <SortableItem key={`sortable-${goal.id}`} goal={goal} />
    </div>
  );
};

export default React.memo(GoalItemWrapper);
