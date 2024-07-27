import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import useArchivedGoals from "@src/hooks/useArchivedGoals";
import AutocompleteComponent from "@src/common/AutoComplete";

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

  const filterData = (archivedInputValue: string, data: GoalItem[]): GoalItem[] => {
    return data.filter((item) => {
      return item.title.toLowerCase().startsWith(archivedInputValue.toLowerCase());
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
