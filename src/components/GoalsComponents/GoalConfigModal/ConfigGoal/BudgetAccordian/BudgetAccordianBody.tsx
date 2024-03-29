import { Slider } from "antd";
import React from "react";
import BudgetWeekSlider from "./BudgetWeekSlider";

interface IBudgetAccordianBodyProps {
  budgetPerHrSummary: string | number;
  tags: string[];
  afterTime: number;
  beforeTime: number;
  perDayHrs: number[];
  perWeekHrs: number[];
  setPerDayHrs: React.Dispatch<React.SetStateAction<number[]>>;
  setPerWeekHrs: React.Dispatch<React.SetStateAction<number[]>>;
  handleSliderChange: (val: number[], setPerHrs: React.Dispatch<React.SetStateAction<number[]>>) => void;
}

const BudgetAccordianBody = ({
  budgetPerHrSummary,
  tags,
  afterTime,
  beforeTime,
  perDayHrs,
  perWeekHrs,
  setPerDayHrs,
  setPerWeekHrs,
  handleSliderChange,
}: IBudgetAccordianBodyProps) => {
  return (
    <div>
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
      <BudgetWeekSlider
        perWeekHrs={perWeekHrs}
        perDayHrs={perDayHrs}
        setPerWeekHrs={setPerWeekHrs}
        setPerDayHrs={setPerDayHrs}
        onDays={tags.on}
      />
    </div>
  );
};

export default BudgetAccordianBody;
