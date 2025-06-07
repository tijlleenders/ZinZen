import { Slider } from "antd";
import { SliderMarks } from "antd/es/slider";
import React from "react";
import { sliderTooltipAlignConfig } from "./ConfigGoal.helper";

const BetweenSlider = ({ value: sliderValue, onChange }: { value: number[]; onChange: (value: number[]) => void }) => {
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
          [sliderValue[0]]: `${sliderValue[0]}`,
          [sliderValue[1]]: `${sliderValue[1]}`,
        }}
        range
        value={sliderValue}
        onChange={onChange}
      />
    </>
  );
};

export default BetweenSlider;
