import React, { useEffect, useRef, useState } from "react";
import "./AutoComplete.scss";
import { GoalItem } from "@src/models/GoalItem";

interface AutocompleteComponentProps {
  data: GoalItem[];
  onSuggestionClick: (suggestion: GoalItem) => void;
  onInputChange: (value: string) => void;
  inputvalue: string;
}

const AutocompleteComponent: React.FC<AutocompleteComponentProps> = ({
  data,
  onSuggestionClick,
  onInputChange,
  inputvalue,
}) => {
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const adjustInputWidth = () => {
      if (inputRef.current && spanRef.current) {
        inputRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`;
      }
    };

    adjustInputWidth();
    window.addEventListener("resize", adjustInputWidth);

    return () => {
      window.removeEventListener("resize", adjustInputWidth);
    };
  }, [inputvalue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onInputChange(value);

    if (value.trim() === "") {
      setAutocompleteValue("");
      return;
    }

    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(value.toLowerCase()));
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    setAutocompleteValue(suggestion ? suggestion.title.slice(value.length) : "");
  };

  const handleSuggestionClick = () => {
    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(inputvalue.toLowerCase()));
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    if (suggestion) {
      onSuggestionClick(suggestion);
      onInputChange(suggestion.title);
    }
    setAutocompleteValue("");
  };

  return (
    <div className="autocomplete-container">
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputvalue}
          onChange={handleInputChange}
          placeholder="Type a title..."
        />
        <span ref={spanRef} className="hidden-span">
          {inputvalue}
        </span>
        {autocompleteValue && (
          <span className="autocomplete-suggestion" onClick={handleSuggestionClick}>
            {autocompleteValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default AutocompleteComponent;
