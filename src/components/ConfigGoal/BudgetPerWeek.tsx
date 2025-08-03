import React from "react";
import { Slider } from "antd";
import { sliderTooltipAlignConfig } from "./ConfigGoal.helper";

interface BudgetPerHrProps {
  budgetPerWeekSummary: string;
  minWeekValue: number;
  maxWeekValue: number;
  first: number;
  second: number;
  onChange: (val: number[]) => void;
}

const BudgetPerWeek = ({
  budgetPerWeekSummary,
  minWeekValue,
  maxWeekValue,
  first,
  second,
  onChange,
}: BudgetPerHrProps) => {
  return (
    <>
      <span>{budgetPerWeekSummary}</span>
      <Slider
        tooltip={{
          align: sliderTooltipAlignConfig,
        }}
        min={minWeekValue}
        max={maxWeekValue}
        marks={{
          [minWeekValue]: `${minWeekValue}`,
          [first]: `${first}`,
          [second]: `${second}`,
          [maxWeekValue]: `${maxWeekValue}`,
        }}
        range
        value={[first, second]}
        onChange={onChange}
      />
    </>
  );
};

export default BudgetPerWeek;
