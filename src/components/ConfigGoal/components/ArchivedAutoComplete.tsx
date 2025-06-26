import React, { useState, useCallback } from "react";
import { GoalItem } from "@src/models/GoalItem";
import AutocompleteComponent from "@components/ConfigGoal/components/AutoComplete";
import { fetchArchivedDescendantGoalByTitle } from "@src/api/GoalsAPI";
import { useParams } from "react-router-dom";

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
  const { parentId = "root" } = useParams();

  const [filteredGoals, setFilteredGoals] = useState<GoalItem[]>([]);

  const searchArchivedGoals = useCallback(
    async (value: string) => {
      const goals = await fetchArchivedDescendantGoalByTitle(value, parentId);
      setFilteredGoals(goals);
    },
    [parentId],
  );

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
