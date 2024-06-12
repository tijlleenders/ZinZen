import React, { useEffect, useRef, useState } from "react";
import "./AutoComplete.scss";

interface AutocompleteComponentProps<T> {
  data: T[];
  titleKey: keyof T;
  onSuggestionClick: (suggestion: T) => void;
  filterData: (inputValue: string, data: T[]) => T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutocompleteComponent = <T extends Record<string, any>>({
  data,
  titleKey,
  onSuggestionClick,
  filterData,
}: AutocompleteComponentProps<T>) => {
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

    const filteredData = filterData(value, data);
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    setAutocompleteValue(suggestion ? String(suggestion[titleKey]).slice(value.length) : "");
  };

  const handleSuggestionClick = () => {
    const filteredData = filterData(inputValue, data);
    const suggestion = filteredData.length > 0 ? filteredData[0] : null;
    if (suggestion) {
      onSuggestionClick(suggestion);
      setInputValue(String(suggestion[titleKey]));
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
