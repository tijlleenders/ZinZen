import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { colorPalleteList } from "@src/utils";
import { ColorPaletteProps } from "@src/Interfaces/ICommon";

const ColorPalette: React.FC<ColorPaletteProps> = ({ colorIndex, setColorIndex }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [open, setOpen] = useState(false);
  const getBtn = (color: string, index: number, style = {}) => (
    <button
      type="button"
      key={`color-${color}`}
      style={{ backgroundColor: color, ...style }}
      className="color-btn"
      onClick={() => { if (!open) { setOpen(true); } else { setOpen(false); setColorIndex(index); } }}
    > { colorIndex === index ? "✔" : ""}
    </button>
  );
  return (
    <div>
      <p>
        Change Color:
      </p>
      {open ? (
        <div className="colorPallette">
          {colorPalleteList.map((color, index) => (getBtn(color, index)))}
        </div>
      ) :
        getBtn(colorPalleteList[colorIndex], -1, { width: 110, borderRadius: 4, boxShadow: "var(--shadow)" })}
    </div>
  );
};

export default ColorPalette;
