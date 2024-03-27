import { Slider } from "antd";
import React, { useEffect, useState } from "react";

interface IBudgetWeekSlider {
  perWeekHrs: number[];
  perDayHrs: number[];
  setPerWeekHrs: (value: number[]) => void;
  setPerDayHrs: (value: number[]) => void;
  onDays: string[];
}

const BudgetWeekSlider: React.FC<IBudgetWeekSlider> = ({
  perWeekHrs,
  perDayHrs,
  setPerWeekHrs,
  setPerDayHrs,
  onDays,
}) => {
  const [budgetPerWeekSummary, setBudgetPerWeekSummary] = useState<string>("");
  const numberOfDays = onDays.length;

  const minWeekValue = perDayHrs[0] * numberOfDays;
  const maxWeekValue = perDayHrs[1] * numberOfDays;

  const handleWeekSliderChange = (value: number[]) => {
    let adjustedValue: number[] = value.slice();

    adjustedValue[0] = Math.max(adjustedValue[0], minWeekValue);
    adjustedValue[1] = Math.min(adjustedValue[1], maxWeekValue);

    if (adjustedValue[0] > adjustedValue[1]) {
      [adjustedValue[0], adjustedValue[1]] = [adjustedValue[1], adjustedValue[0]];
    }

    if (perDayHrs[0] === perDayHrs[1]) {
      adjustedValue = [minWeekValue, maxWeekValue];
    }

    adjustedValue = adjustedValue.map((val) => Math.max(minWeekValue, Math.min(val, maxWeekValue)));
    setPerWeekHrs(adjustedValue);
  };

  useEffect(() => {
    handleWeekSliderChange(perWeekHrs);
  }, [perDayHrs, setPerDayHrs, onDays]);

  useEffect(() => {
    const summary =
      perWeekHrs[0] === perWeekHrs[1]
        ? `${perWeekHrs[0]} hrs / week`
        : `${perWeekHrs[0]} - ${perWeekHrs[1]} hrs / week`;

    setBudgetPerWeekSummary(summary);
  }, [perWeekHrs]);

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
