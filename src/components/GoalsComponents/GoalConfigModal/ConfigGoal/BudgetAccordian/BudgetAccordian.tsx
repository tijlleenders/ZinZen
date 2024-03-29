import ZAccordion from "@src/common/Accordion";
import React, { useState } from "react";
import BudgetAccordianBody from "./BudgetAccordianBody";

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
  const [isBudgetAccordianOpen, setIsBudgetAccordianOpen] = useState(false);

  const budgetPerHrSummary = perDayHrs[0] === perDayHrs[1] ? perDayHrs[0] : `${perDayHrs[0]} - ${perDayHrs[1]}`;
  const budgetPerWeekSummary = perWeekHrs[0] === perWeekHrs[1] ? perWeekHrs[0] : `${perWeekHrs[0]} - ${perWeekHrs[1]}`;

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
            <BudgetAccordianBody
              budgetPerHrSummary={budgetPerHrSummary}
              tags={tags}
              afterTime={afterTime}
              beforeTime={beforeTime}
              perDayHrs={perDayHrs}
              perWeekHrs={perWeekHrs}
              setPerDayHrs={setPerDayHrs}
              setPerWeekHrs={setPerWeekHrs}
              handleSliderChange={handleSliderChange}
            />
          ),
        },
      ]}
    />
  );
};

export default BudgetAccordian;
