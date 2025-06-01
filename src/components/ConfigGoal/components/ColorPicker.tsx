import React, { useState, useEffect } from "react";
import { colorPalleteList } from "@src/utils";
import { ColorPaletteProps } from "@src/Interfaces/ICommon";
import "./ColorPicker.scss";

const ColorPicker: React.FC<ColorPaletteProps> = ({ colorIndex, setColorIndex }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (index: number) => {
    setColorIndex(index);
    setIsOpen(false);
  };

  const toggleColorPalette = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      action();
    }
  };

  useEffect(() => {
    const element = document.getElementById(`color-${colorIndex}`);
    if (element !== null) {
      element.focus();
    }
  }, [isOpen, colorIndex]);

  return (
    <div className="color-picker-container">
      <div
        className="goal-color"
        style={{ backgroundColor: colorPalleteList[colorIndex] }}
        onClick={toggleColorPalette}
        onKeyDown={(e) => handleKeyDown(e, toggleColorPalette)}
        role="button"
        tabIndex={0}
        aria-label="Select color"
        aria-expanded={isOpen}
      />

      {isOpen && (
        <div className="color-palette-popup">
          {colorPalleteList.map((color, index) => (
            <button
              id={`color-${index}`}
              key={`color-${color}`}
              className="color-btn"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, () => handleColorSelect(index))}
              type="button"
              aria-label={`Color ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(ColorPicker);
