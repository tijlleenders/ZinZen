import { Slider } from "antd";
import React from "react";

interface IBudgetWeekSlider {
  perWeekHrs: number[];
  budgetPerWeekSummary: string;
  minWeekValue: number;
  maxWeekValue: number;
  handleWeekSliderChange: (val: number[]) => void;
}

const BudgetWeekSlider: React.FC<IBudgetWeekSlider> = ({
  perWeekHrs,
  budgetPerWeekSummary,
  minWeekValue,
  maxWeekValue,
  handleWeekSliderChange,
}) => {
  return (
    <div>
      <span>{budgetPerWeekSummary}</span>
      <Slider
        tooltip={{ prefixCls: "per-week-tooltip" }}
        min={minWeekValue}
        max={maxWeekValue}
        marks={{
          [minWeekValue]: `${minWeekValue}`,
          [perWeekHrs[0]]: `${perWeekHrs[0]}`,
          [perWeekHrs[1]]: `${perWeekHrs[1]}`,
          [maxWeekValue]: `${maxWeekValue}`,
        }}
        range
        value={[perWeekHrs[0], perWeekHrs[1]]}
        onChange={(val) => handleWeekSliderChange(val)}
      />
    </div>
  );
};

export default BudgetWeekSlider;
