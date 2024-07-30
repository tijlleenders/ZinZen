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
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const suggestionRef = useRef<HTMLSpanElement>(null);

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
        setAutocompleteValue("");
        setIsSuggestionVisible(false);
        return;
      }
      const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(value.toLowerCase()));
      const suggestion = filteredData.length > 0 ? filteredData[0] : null;
      setAutocompleteValue(suggestion ? suggestion.title.slice(value.length) : "");
      setIsSuggestionVisible(!!suggestion);
    },
    [onInputChange, data],
  );

  const handleSuggestionClick = useCallback(() => {
    const filteredData = data.filter((item) => item.title.toLowerCase().startsWith(inputvalue.toLowerCase()));
    console.log(filteredData);

    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    if (suggestion && suggestionRef.current) {
      onSuggestionClick(suggestion);
      onInputChange(suggestion.title);
    }
    setAutocompleteValue("");
  }, [inputvalue, data]);

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
        {autocompleteValue && (
          <span ref={suggestionRef} className="autocomplete-suggestion">
            {autocompleteValue}
          </span>
        )}
      </button>
    </div>
  );
};

export default AutocompleteComponent;
