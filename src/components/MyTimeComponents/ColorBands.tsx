import { ITaskOfDay } from "@src/Interfaces/Task";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface IColorBands {
  list: ITaskOfDay;
}

const ColorBands: React.FC<IColorBands> = ({ list }) => {
  return (
    <div className="MyTime_colorPalette">
      {(list.colorBands || []).map((ele, index) => (
        <div className="colorBand" key={uuidv4()} style={{ zIndex: 30 - index, height: 10, ...ele.style }} />
      ))}
    </div>
  );
};

export default ColorBands;
