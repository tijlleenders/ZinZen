import React, { useState } from "react";
import { colorPalleteList } from "@src/utils";
import { ColorPaletteProps } from "@src/Interfaces/ICommon";
import { useTranslation } from "react-i18next";

const ColorPalette: React.FC<ColorPaletteProps> = ({ colorIndex, setColorIndex }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const getBtn = (color: string, index: number, style = {}) => (
    <button
      type="button"
      key={`color-${color}`}
      style={{ backgroundColor: color, ...style }}
      className="color-btn"
      onClick={() => {
        if (!open) {
          setOpen(true);
        } else {
          setOpen(false);
          setColorIndex(index);
        }
      }}
    >
      {" "}
      {colorIndex === index ? "✔" : ""}
    </button>
  );
  return (
    <div>
      <p>{t("Change Color")}:</p>
      {open ? (
        <div className="colorPallette">{colorPalleteList.map((color, index) => getBtn(color, index))}</div>
      ) : (
        getBtn(colorPalleteList[colorIndex], -1, { width: 110, borderRadius: 4, boxShadow: "var(--shadow)" })
      )}
    </div>
  );
};

export default ColorPalette;
