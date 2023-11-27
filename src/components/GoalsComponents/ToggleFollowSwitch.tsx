/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import "./ToggleFollowSwitch.scss";

interface ToggleSwitchProps {
  onChange: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onChange }) => {
  const [checked, setChecked] = useState(false);

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
      className="toggle-switch"
      onClick={toggle}
      onKeyDown={handleKeyPress}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
    >
      <input type="checkbox" className="checkbox" checked={checked} readOnly tabIndex={-1} />
      <label className="label">
        <span className="inner" />
        <span className="switch" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
