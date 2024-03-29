import ZAccordion from "@src/common/Accordion";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { budgetAccordianOpenState } from "@src/store";
import BudgetWeekSlider from "./BudgetWeekSlider";
import BudgetDaySlider from "./BudgetDaySlider";

interface IBudgetAccordianProps {
  onDays: string[];
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
  onDays,
  afterTime,
  beforeTime,
}: IBudgetAccordianProps) => {
  const [isBudgetAccordianOpen, setIsBudgetAccordianOpen] = useRecoilState(budgetAccordianOpenState);

  const budgetPerHrSummary =
    perDayHrs[0] === perDayHrs[1] ? perDayHrs[0].toString() : `${perDayHrs[0]} - ${perDayHrs[1]}`;
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
    <ZAccordion
      showCount={false}
      style={{
        border: "none",
        background: "var(--secondary-background)",
      }}
      onChange={() => setIsBudgetAccordianOpen(!isBudgetAccordianOpen)}
      panels={[
        {
          header: isBudgetAccordianOpen ? "Budget" : `${budgetPerHrSummary} hr / day, ${budgetPerWeekSummary}`,
          body: (
            <div>
              <BudgetDaySlider
                perDayHrs={perDayHrs}
                beforeTime={beforeTime}
                afterTime={afterTime}
                handleSliderChange={handleSliderChange}
                setPerDayHrs={setPerDayHrs}
                budgetPerHrSummary={budgetPerHrSummary}
              />

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
