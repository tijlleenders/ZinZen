import ZAccordion from "@src/common/Accordion";
import React, { useEffect, useState } from "react";
import BudgetAccordianBody from "./BudgetAccordianBody";
import { useRecoilState } from "recoil";
import { budgetAccordianOpenState } from "@src/store";
import BudgetWeekSlider from "./BudgetWeekSlider";
import { Slider } from "antd";

interface IBudgetAccordianProps {
  tags: string[];
  afterTime: number;
  beforeTime: number;
  perDayHrs: number[];
  perWeekHrs: number[];
  setPerDayHrs: React.Dispatch<React.SetStateAction<number[]>>;
  setPerWeekHrs: React.Dispatch<React.SetStateAction<number[]>>;
  handleSliderChange: (val: number[], setPerHrs: React.Dispatch<React.SetStateAction<number[]>>) => void;
}

const BudgetAccordian = ({
  perDayHrs,
  perWeekHrs,
  setPerDayHrs,
  setPerWeekHrs,
  handleSliderChange,
  tags,
  afterTime,
  beforeTime,
}: IBudgetAccordianProps) => {
  const [isBudgetAccordianOpen, setIsBudgetAccordianOpen] = useRecoilState(budgetAccordianOpenState);

  const budgetPerHrSummary = perDayHrs[0] === perDayHrs[1] ? perDayHrs[0] : `${perDayHrs[0]} - ${perDayHrs[1]}`;

  const [budgetPerWeekSummary, setBudgetPerWeekSummary] = useState<string>("");
  const onDays = tags.on;
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
    <ZAccordion
      showCount={false}
      style={{
        border: "none",
        background: "var(--secondary-background)",
      }}
      onChange={() => setIsBudgetAccordianOpen(!isBudgetAccordianOpen)}
      panels={[
        {
          header: isBudgetAccordianOpen
            ? "Budget"
            : `${budgetPerHrSummary} hr / day, ${budgetPerWeekSummary} hrs / week`,
          body: (
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
                budgetPerWeekSummary={budgetPerWeekSummary}
                minWeekValue={minWeekValue}
                maxWeekValue={maxWeekValue}
                handleWeekSliderChange={handleWeekSliderChange}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default BudgetAccordian;
