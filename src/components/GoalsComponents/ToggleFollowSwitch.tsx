/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import "./ToggleFollowSwitch.scss";

interface ToggleSwitchProps {
  onChange: (value: boolean) => void;
  initialChecked: boolean;
}

const ToggleFollowSwitch: React.FC<ToggleSwitchProps> = ({ onChange, initialChecked }) => {
  const [checked, setChecked] = useState(initialChecked);

  const toggle = () => {
    const updatedChecked = !checked;
    setChecked(updatedChecked);
    onChange(updatedChecked);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " || event.key === "Enter") {
      toggle();
    }
  };

  return (
    <div
      className={`toggle-switch ${checked ? "checked" : ""}`}
      onClick={toggle}
      onKeyDown={handleKeyPress}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
    >
      <input type="checkbox" className="checkbox" checked={checked} readOnly />
      <label className="label">
        <span className="inner" />
        <span className="switch" />
      </label>
    </div>
  );
};

export default ToggleFollowSwitch;
