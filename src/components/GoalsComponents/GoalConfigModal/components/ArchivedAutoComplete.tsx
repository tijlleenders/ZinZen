import React, { useState, useCallback } from "react";
import { GoalItem } from "@src/models/GoalItem";
import AutocompleteComponent from "@components/GoalsComponents/GoalConfigModal/components/AutoComplete";
import { fetchArchivedGoalByTitle } from "@src/api/GoalsAPI";

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
  const [filteredGoals, setFilteredGoals] = useState<GoalItem[]>([]);

  const searchArchivedGoals = useCallback(async (value: string) => {
    const goals = await fetchArchivedGoalByTitle(value);
    setFilteredGoals(goals);
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      onInputChange(value);
      searchArchivedGoals(value);
    },
    [onInputChange, searchArchivedGoals],
  );

  return (
    <AutocompleteComponent
      inputvalue={inputValue}
      data={filteredGoals}
      onSuggestionClick={onGoalSelect}
      onInputChange={handleInputChange}
      placeholder={placeholder}
    />
  );
};

export default ArchivedAutoComplete;
