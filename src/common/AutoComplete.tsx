import React, { useEffect, useRef, useState } from "react";
import "./AutoComplete.scss";
import { GoalItem } from "@src/models/GoalItem";

interface AutocompleteComponentProps {
  data: GoalItem[];
  onSuggestionClick: (suggestion: GoalItem) => void;
}

const AutocompleteComponent: React.FC<AutocompleteComponentProps> = ({ data, onSuggestionClick }) => {
  const [inputValue, setInputValue] = useState("");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      inputRef.current.style.width = "inherit";
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);

    if (value.trim() === "") {
      setAutocompleteValue("");
      return;
    }

    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(value.toLowerCase()));
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    setAutocompleteValue(suggestion ? suggestion.title.slice(value.length) : "");
  };

  const handleSuggestionClick = () => {
    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(inputValue.toLowerCase()));
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    if (suggestion) {
      onSuggestionClick(suggestion);
      setInputValue(suggestion.title);
    }
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
          placeholder="Type a title..."
        />
        <span ref={spanRef} className="hidden-span">
          {inputValue}
        </span>
        {autocompleteValue && (
          <button className="autocomplete-suggestion" type="button" onClick={handleSuggestionClick}>
            {autocompleteValue}
          </button>
        )}
      </div>
    </div>
  );
};

export default AutocompleteComponent;
