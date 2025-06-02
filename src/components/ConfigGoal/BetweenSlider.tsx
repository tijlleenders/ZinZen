import { Slider } from "antd";
import { SliderMarks } from "antd/es/slider";
import React from "react";
import { sliderTooltipAlignConfig } from "./ConfigGoal.helper";

const BetweenSlider = ({ value, onChange }: { value: number[]; onChange: (value: number[]) => void }) => {
  const marks: SliderMarks = { 0: "0", 24: "24" };

  return (
    <>
      <span>Between</span>
      <Slider
        tooltip={{
          align: sliderTooltipAlignConfig,
        }}
        min={0}
        max={24}
        marks={{
          ...marks,
          [value[0]]: `${value[0]}`,
          [value[1]]: `${value[1]}`,
        }}
        range
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default BetweenSlider;
