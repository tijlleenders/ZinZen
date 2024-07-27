import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import useArchivedGoals from "@src/hooks/useArchivedGoals";
import AutocompleteComponent from "@src/common/AutoComplete";

interface ArchivedAutoCompleteProps {
  onGoalSelect: (goal: GoalItem) => void;
  onInputChange: (value: string) => void;
  inputValue: string;
  placeholder: string;
}

const ArchivedAutoComplete: React.FC<ArchivedAutoCompleteProps> = ({
  onGoalSelect,
  onInputChange,
  inputValue,
  placeholder,
}) => {
  const archivedGoals = useArchivedGoals();

  const filteredGoals = archivedGoals.filter((item) => item.title.toLowerCase().startsWith(inputValue.toLowerCase()));

  return (
    <AutocompleteComponent
      inputvalue={inputValue}
      data={filteredGoals}
      onSuggestionClick={onGoalSelect}
      onInputChange={onInputChange}
      placeholder={placeholder}
    />
  );
};

export default ArchivedAutoComplete;
