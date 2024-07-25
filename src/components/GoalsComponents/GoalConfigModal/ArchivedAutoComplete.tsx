import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import useArchivedGoals from "@src/hooks/useArchivedGoals";
import AutocompleteComponent from "@src/common/AutoComplete";
import { useLocation } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";

const ArchivedAutoComplete = ({
  onGoalSelect,
  onInputChange,
  inputvalue,
}: {
  onGoalSelect: (goal: GoalItem) => void;
  onInputChange: (value: string) => void;
  inputvalue: string;
}) => {
  const archivedGoals = useArchivedGoals();
  const { state }: { state: ILocationState } = useLocation();

  const filterData = (archivedInputValue: string, data: GoalItem[]): GoalItem[] => {
    const type = state?.goalType;
    return data.filter((item) => {
      const isGoal = !item.timeBudget;
      return isGoal === (type === "Goal") && item.title.toLowerCase().startsWith(archivedInputValue.toLowerCase());
    });
  };

  const filteredGoals = filterData("", archivedGoals);

  console.log(inputvalue);

  return (
    <AutocompleteComponent
      inputvalue={inputvalue}
      data={filteredGoals}
      onSuggestionClick={onGoalSelect}
      onInputChange={(value) => onInputChange(value)}
    />
  );
};

export default ArchivedAutoComplete;
