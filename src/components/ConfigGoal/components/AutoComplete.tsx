import React, { useState, useRef, useEffect } from "react";
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
  const [suggestion, setSuggestion] = useState<string>("");
  const [remainingText, setRemainingText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const ghostTextRef = useRef<HTMLSpanElement>(null);
  const measureSpanRef = useRef<HTMLSpanElement>(null);

  const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(value);

    if (value.trim() === "") {
      setSuggestion("");
      setRemainingText("");
      return;
    }

    const matchingGoal = data.find((goal) => goal.title.toLowerCase().startsWith(value.toLowerCase()));

    if (matchingGoal && matchingGoal.title.toLowerCase() !== value.toLowerCase()) {
      setSuggestion(matchingGoal.title);
      // Calculate the remaining text (what user hasn't typed yet)
      const remaining = matchingGoal.title.substring(value.length);
      setRemainingText(remaining);
    } else {
      setSuggestion("");
      setRemainingText("");
    }
  };

  const handleSuggestionClick = () => {
    if (suggestion) {
      const matchingGoal = data.find((goal) => goal.title === suggestion);
      if (matchingGoal) {
        onSuggestionClick(matchingGoal);
        setSuggestion("");
        setRemainingText("");
      }
    }
  };

  // Update ghost text position based on input text width
  useEffect(() => {
    if (measureSpanRef.current && ghostTextRef.current && remainingText) {
      measureSpanRef.current.textContent = inputvalue;
      const textWidth = measureSpanRef.current.offsetWidth;
      ghostTextRef.current.style.left = `${textWidth}px`;
    }
  }, [inputvalue, remainingText]);

  return (
    <div className="w-100 ">
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
        <span ref={measureSpanRef} className="measure-span">
          {inputvalue}
        </span>
        {remainingText && (
          <span
            ref={ghostTextRef}
            className="autocomplete-ghost-text"
            onClickCapture={handleSuggestionClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSuggestionClick();
              }
            }}
          >
            {remainingText}
          </span>
        )}
      </div>
    </div>
  );
};

export default AutocompleteComponent;
