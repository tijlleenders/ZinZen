import React from "react";
import GoalsList from "@components/GoalsComponents/GoalsList";
import { GoalItem } from "@src/models/GoalItem";
import { searchQueryState } from "@src/store/GoalsState";
import { useRecoilValue } from "recoil";
import { useGoalKeyboardNavigation } from "@src/hooks/useGoalKeyboardNavigation";

export const ActiveGoals = ({ goals }: { goals: GoalItem[] }) => {
  const searchQuery = useRecoilValue(searchQueryState);
  const filteredActiveGoals = goals?.filter((goal) => goal.title.toLowerCase().includes(searchQuery.toLowerCase()));
  useGoalKeyboardNavigation({ goals });

  return <GoalsList goals={filteredActiveGoals || []} />;
};
