import React, { useEffect, useRef, useState } from "react";
import "./AutoComplete.scss";
import { GoalItem } from "@src/models/GoalItem";

interface AutocompleteComponentProps {
  data: GoalItem[];
  onSuggestionClick: (suggestion: GoalItem) => void;
  onInputChange: (value: string) => void;
  inputvalue: string;
  placeholder: string;
  isModal?: boolean;
}

const AutocompleteComponent: React.FC<AutocompleteComponentProps> = ({
  data,
  onSuggestionClick,
  onInputChange,
  inputvalue,
  placeholder,
  isModal = false,
}) => {
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const suggestionRef = useRef<HTMLSpanElement>(null);

  const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(value);

    if (value.trim() === "") {
      setIsSuggestionVisible(false);
      setSuggestion("");
      return;
    }

    const matchingGoal = data.find((goal) => goal.title.toLowerCase().startsWith(value.toLowerCase()));
    if (matchingGoal && matchingGoal.title.toLowerCase() !== value.toLowerCase()) {
      setSuggestion(matchingGoal.title);
      setIsSuggestionVisible(true);
    } else {
      setIsSuggestionVisible(false);
      setSuggestion("");
    }
  };

  const handleSuggestionClick = () => {
    if (suggestion && isSuggestionVisible) {
      const matchingGoal = data.find((goal) => goal.title === suggestion);
      if (matchingGoal) {
        onSuggestionClick(matchingGoal);
      }
    }
  };

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = inputvalue;
    }
  }, [inputvalue]);

  useEffect(() => {
    if (suggestionRef.current && isSuggestionVisible) {
      suggestionRef.current.style.width = `${spanRef.current?.offsetWidth || 0}px`;
    }
  }, [suggestion, isSuggestionVisible]);

  return (
    <button className="autocomplete-container w-100 simple" type="button" onClick={handleSuggestionClick}>
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputvalue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="ordinary-element"
          id={isModal ? "title-field-modal" : "title-field"}
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
      </div>
    </button>
  );
};

export default AutocompleteComponent;
