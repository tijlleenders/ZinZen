import { Slider } from "antd";
import React from "react";

interface IBudgetDaySlider {
  perDayHrs: number[];
  beforeTime: number;
  afterTime: number;
  handleSliderChange: (val: number[], setPerHrs: React.Dispatch<React.SetStateAction<number[]>>) => void;
  setPerDayHrs: React.Dispatch<React.SetStateAction<number[]>>;
  budgetPerHrSummary: string;
}

const BudgetDaySlider = ({
  perDayHrs,
  beforeTime,
  afterTime,
  handleSliderChange,
  setPerDayHrs,
  budgetPerHrSummary,
}: IBudgetDaySlider) => {
  return (
    <div>
      <span>{budgetPerHrSummary} hrs / day</span>
      <Slider
        tooltip={{ prefixCls: "per-day-tooltip" }}
        min={0}
        max={beforeTime - afterTime}
        marks={{
          0: "0",
          [perDayHrs[0]]: `${perDayHrs[0]}`,
          [perDayHrs[1]]: `${perDayHrs[1]}`,
          [beforeTime - afterTime]: `${beforeTime - afterTime}`,
        }}
        range
        value={[perDayHrs[0], perDayHrs[1]]}
        onChange={(val) => handleSliderChange(val, setPerDayHrs)}
      />
    </div>
  );
};

export default BudgetDaySlider;
