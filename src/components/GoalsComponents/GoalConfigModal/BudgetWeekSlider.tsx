import { Slider } from "antd";
import React, { useEffect } from "react";

interface IBudgetWeekSlider {
  perWeekHrs: number[];
  perDayHrs: number[];
  setPerWeekHrs: (value: number[]) => void;
  setPerDayHrs: (value: number[]) => void;
}

const BudgetWeekSlider: React.FC<IBudgetWeekSlider> = ({ perWeekHrs, perDayHrs, setPerWeekHrs, setPerDayHrs }) => {
  const budgetPerWeekSummary = perWeekHrs[0] === perWeekHrs[1] ? perWeekHrs[0] : `${perWeekHrs[0]} - ${perWeekHrs[1]}`;
  const minWeekValue = perDayHrs[0] * 7;
  const maxWeekValue = perDayHrs[1] * 7;

  const handleWeekSliderChange = (value: number[]) => {
    if (value[0] < minWeekValue) {
      setPerWeekHrs([minWeekValue, value[1]]);
    } else if (value[1] > maxWeekValue) {
      setPerWeekHrs([value[0], maxWeekValue]);
    } else {
      setPerWeekHrs(value);
    }
  };

  useEffect(() => {
    handleWeekSliderChange(perWeekHrs);
  }, [perDayHrs, setPerDayHrs]);

  return (
    <div>
      <span>{budgetPerWeekSummary} hrs / week</span>
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
