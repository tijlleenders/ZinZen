import { Slider } from "antd";
import React from "react";
import { sliderTooltipAlignConfig } from "./ConfigGoal.helper";

interface BudgetPerHrProps {
  budgetPerHrSummary: string;
  first: number;
  second: number;
  max: number;
  onChange: (val: number[]) => void;
}

const BudgetPerHr = ({ budgetPerHrSummary, first, second, max, onChange }: BudgetPerHrProps) => {
  return (
    <>
      <span>{budgetPerHrSummary} hrs / day</span>
      <Slider
        tooltip={{
          align: sliderTooltipAlignConfig,
        }}
        min={0}
        max={max}
        marks={{
          0: "0",
          [first]: `${first}`,
          [second]: `${second}`,
          [max]: `${max}`,
        }}
        range
        value={[first, second]}
        onChange={onChange}
      />
    </>
  );
};

export default BudgetPerHr;
