import { getArchivedGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import React, { useEffect, useRef, useState } from "react";
import "./AutoComplete.scss"; // Import CSS file

const AutocompleteComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  useEffect(() => {
    const fetchArchivedGoals = async () => {
      const goals = await getArchivedGoals();
      setArchivedGoals(goals);
    };
    fetchArchivedGoals();
  }, []);

  useEffect(() => {
    // Adjust the width of the input based on the span's width
    if (inputRef.current && spanRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`; // Adding small extra space for cursor
    }
  }, [inputValue]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);

    if (value.trim() === "") {
      setAutocompleteValue("");
      return;
    }

    const suggestion = archivedGoals.find((item) => item.title.toLowerCase().startsWith(value.toLowerCase()));
    setAutocompleteValue(suggestion ? suggestion.title.slice(value.length) : "");
  };

  const handleSuggestionClick = () => {
    setInputValue(inputValue + autocompleteValue);
    setAutocompleteValue("");
  };

  return (
    <div className="autocomplete-container">
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a goal/budget title..."
        />
        <span ref={spanRef} className="hidden-span">
          {inputValue}
        </span>
        {autocompleteValue && (
          <button className="autocomplete-suggestion" type="button" onClickDown={handleSuggestionClick}>
            {autocompleteValue}
          </button>
        )}
      </div>
    </div>
  );
};

export default AutocompleteComponent;
