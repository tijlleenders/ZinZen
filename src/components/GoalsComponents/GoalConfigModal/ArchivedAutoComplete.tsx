import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import useArchivedGoals from "@src/hooks/useArchivedGoals";
import AutocompleteComponent from "@src/common/AutoComplete";
import { useLocation } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";

const ArchivedAutoComplete = ({ onGoalSelect }: { onGoalSelect: (goal: GoalItem) => void }) => {
  const archivedGoals = useArchivedGoals();
  const { state }: { state: ILocationState } = useLocation();

  const filterData = (inputValue: string, data: GoalItem[]): GoalItem[] => {
    const type = state?.goalType;
    return data.filter((item) => {
      const isGoal = !item.timeBudget;
      return isGoal === (type === "Goal") && item.title.toLowerCase().startsWith(inputValue.toLowerCase());
    });
  };

  const filteredGoals = filterData("", archivedGoals);

  return <AutocompleteComponent data={filteredGoals} onSuggestionClick={onGoalSelect} />;
};

export default ArchivedAutoComplete;
