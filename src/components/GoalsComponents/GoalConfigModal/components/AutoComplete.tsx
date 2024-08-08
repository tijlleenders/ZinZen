import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AutoComplete.scss";
import { GoalItem } from "@src/models/GoalItem";

interface AutocompleteComponentProps {
  data: GoalItem[];
  onSuggestionClick: (suggestion: GoalItem) => void;
  onInputChange: (value: string) => void;
  inputvalue: string;
  placeholder: string;
}

const AutocompleteComponent: React.FC<AutocompleteComponentProps> = ({
  data,
  onSuggestionClick,
  onInputChange,
  inputvalue,
  placeholder,
}) => {
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const suggestionRef = useRef<HTMLSpanElement>(null);

  const getSuggestion = (value: string): string => {
    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(value.toLowerCase()));
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    return suggestion ? suggestion.title.slice(value.length) : "";
  };

  // Adjust input width
  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      inputRef.current.style.width = isSuggestionVisible ? `${spanRef.current.offsetWidth + 2}px` : "100%";
    }
  }, [inputvalue, isSuggestionVisible]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onInputChange(value);
      if (value.trim() === "") {
        setIsSuggestionVisible(false);
        return;
      }
      const suggestion = getSuggestion(value);
      setIsSuggestionVisible(!!suggestion);
    },
    [onInputChange, data],
  );

  const handleSuggestionClick = useCallback(() => {
    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(inputvalue.toLowerCase()));
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    if (suggestion && suggestionRef.current) {
      onSuggestionClick(suggestion);
      onInputChange(suggestion.title);
    }
    setIsSuggestionVisible(false);
  }, [inputvalue, data, onSuggestionClick, onInputChange]);

  const suggestion = getSuggestion(inputvalue);

  return (
    <div className="autocomplete-container w-100">
      <button type="button" className="autocomplete-input-wrapper simple" onClick={handleSuggestionClick}>
        <input
          ref={inputRef}
          type="text"
          value={inputvalue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="ordinary-element"
          id="title-field"
          inputMode="text"
        />
        <span ref={spanRef} className="hidden-span">
          {inputvalue}
        </span>
        {isSuggestionVisible && suggestion && (
          <span ref={suggestionRef} className="autocomplete-suggestion">
            {suggestion}
          </span>
        )}
      </button>
    </div>
  );
};

export default AutocompleteComponent;
