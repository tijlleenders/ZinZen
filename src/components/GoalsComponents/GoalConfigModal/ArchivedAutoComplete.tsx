import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import useArchivedGoals from "@src/hooks/useArchivedGoals";
import AutocompleteComponent from "@src/common/AutoComplete";
import { useLocation } from "react-router-dom";
import { ILocationState } from "@src/Interfaces";

interface ArchivedAutoCompleteProps {
  onGoalSelect: (goal: GoalItem) => void;
  onInputChange: (value: string) => void;
  inputvalue: string;
  placeholder: string;
}

const ArchivedAutoComplete: React.FC<ArchivedAutoCompleteProps> = ({
  onGoalSelect,
  onInputChange,
  inputvalue,
  placeholder,
}) => {
  const archivedGoals = useArchivedGoals();
  const { state }: { state: ILocationState } = useLocation();

  const filterData = (archivedInputValue: string, data: GoalItem[]): GoalItem[] => {
    const goalType = state?.goalType;
    return data.filter((item) => {
      const isGoal = !item.timeBudget;
      return (
        isGoal === (goalType === "Standard" || goalType === "Goal" || goalType === "Cluster") &&
        item.title.toLowerCase().startsWith(archivedInputValue?.toLowerCase())
      );
    });
  };

  const filteredGoals = filterData(inputvalue, archivedGoals);

  return (
    <AutocompleteComponent
      inputvalue={inputvalue}
      data={filteredGoals}
      onSuggestionClick={onGoalSelect}
      onInputChange={(value) => onInputChange(value)}
      placeholder={placeholder}
    />
  );
};

export default ArchivedAutoComplete;
