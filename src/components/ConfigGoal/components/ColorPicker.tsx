import React, { useState, useEffect } from "react";
import { colorPalleteList } from "@src/utils";
import "./ColorPicker.scss";

export interface ColorPaletteProps {
  color: string;
  setColor: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPaletteProps> = ({ color, setColor, className }) => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

  const handleColorSelect = (index: number) => {
    setColor(colorPalleteList[index]);
    setIsColorPaletteOpen(false);
  };

  const toggleColorPalette = () => {
    setIsColorPaletteOpen(!isColorPaletteOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      action();
    }
  };

  useEffect(() => {
    const element = document.getElementById(`color-${colorPalleteList.indexOf(color)}`);
    if (element !== null) {
      element.focus();
    }
  }, [isColorPaletteOpen, color]);

  return (
    <div className={`color-picker-container ${className}`}>
      <button
        type="button"
        className="goal-color"
        style={{ backgroundColor: color }}
        onClick={toggleColorPalette}
        onKeyDown={(e) => handleKeyDown(e, toggleColorPalette)}
        aria-label="Color Picker"
      />

      {isColorPaletteOpen && (
        <div className="color-palette-popup">
          {colorPalleteList.map((colorItem, index) => (
            <button
              id={`color-${index}`}
              key={`color-${colorItem}`}
              className="color-btn"
              style={{ backgroundColor: colorItem }}
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
